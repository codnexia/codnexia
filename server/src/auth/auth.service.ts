import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { and, desc, eq, ne, sql } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { ActivityService } from '../activity/activity.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

// In-memory login attempt tracking (per-email)
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
    private readonly activityService: ActivityService,
  ) {}

  async login(dto: LoginDto) {
    // Account lockout check
    const attempt = loginAttempts.get(dto.email);
    if (attempt && attempt.lockedUntil > Date.now()) {
      const minutesLeft = Math.ceil((attempt.lockedUntil - Date.now()) / 60000);
      throw new UnauthorizedException(
        `Account temporarily locked. Try again in ${minutesLeft} minute(s).`,
      );
    }

    const [user] = await this.db
      .select()
      .from(schema.admins)
      .where(eq(schema.admins.email, dto.email));

    if (!user) {
      this.recordFailedAttempt(dto.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      this.recordFailedAttempt(dto.email);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Clear failed attempts on successful login
    loginAttempts.delete(dto.email);

    // Log login activity for the admin dashboard (non-blocking)
    try { await this.activityService.log('login', `${user.name} logged in`, '#2DD4A8'); }
    catch (e) { this.logger.warn(`Activity log failed: ${(e as Error).message}`); }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken: this.generateToken(user.id, user.email),
    };
  }

  private recordFailedAttempt(email: string) {
    const attempt = loginAttempts.get(email) ?? { count: 0, lockedUntil: 0 };
    attempt.count += 1;
    if (attempt.count >= MAX_ATTEMPTS) {
      attempt.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      attempt.count = 0;
      this.logger.warn(`Account locked for ${email} after ${MAX_ATTEMPTS} failed attempts`);
    }
    loginAttempts.set(email, attempt);
  }

  async getProfile(userId: string) {
    const [user] = await this.db
      .select({
        id: schema.admins.id,
        name: schema.admins.name,
        email: schema.admins.email,
        createdAt: schema.admins.createdAt,
      })
      .from(schema.admins)
      .where(eq(schema.admins.id, userId));

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  // Update admin profile (name and/or email)
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Check email uniqueness if changing email
    if (dto.email) {
      const [existing] = await this.db
        .select({ id: schema.admins.id })
        .from(schema.admins)
        .where(and(eq(schema.admins.email, dto.email), ne(schema.admins.id, userId)));
      if (existing) {
        throw new ConflictException('An account with this email already exists');
      }
    }

    const [user] = await this.db
      .update(schema.admins)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(schema.admins.id, userId))
      .returning({
        id: schema.admins.id,
        name: schema.admins.name,
        email: schema.admins.email,
        createdAt: schema.admins.createdAt,
      });

    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  // Issue a fresh JWT for an authenticated user (token refresh)
  async refresh(userId: string, email: string) {
    return { accessToken: this.generateToken(userId, email) };
  }

  // Generate a one-time invite token (7-day expiry)
  async generateInvite(creatorId: string) {
    const token = crypto.randomBytes(32).toString('hex'); // 64-char hex
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const [invite] = await this.db
      .insert(schema.inviteTokens)
      .values({ token, createdBy: creatorId, expiresAt })
      .returning();

    try {
      await this.activityService.log(
        'invite',
        'Admin generated an invite token',
        '#8B5CF6',
      );
    } catch (e) {
      this.logger.warn(`Activity log failed: ${(e as Error).message}`);
    }

    return { token: invite.token, expiresAt: invite.expiresAt };
  }

  // Register a new admin using a valid invite token
  async register(dto: RegisterDto) {
    // Validate the invite token
    const [invite] = await this.db
      .select()
      .from(schema.inviteTokens)
      .where(
        and(
          eq(schema.inviteTokens.token, dto.inviteToken),
          eq(schema.inviteTokens.used, false),
        ),
      );

    if (!invite) {
      throw new BadRequestException('Invalid or already used invite token');
    }

    if (new Date() > invite.expiresAt) {
      throw new BadRequestException('Invite token has expired');
    }

    // Check email uniqueness
    const [existing] = await this.db
      .select({ id: schema.admins.id })
      .from(schema.admins)
      .where(eq(schema.admins.email, dto.email));

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    // Create admin
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const [admin] = await this.db
      .insert(schema.admins)
      .values({ name: dto.name, email: dto.email, password: hashedPassword })
      .returning({
        id: schema.admins.id,
        name: schema.admins.name,
        email: schema.admins.email,
        createdAt: schema.admins.createdAt,
      });

    // Mark token as used
    await this.db
      .update(schema.inviteTokens)
      .set({ used: true, usedBy: admin.id })
      .where(eq(schema.inviteTokens.id, invite.id));

    try {
      await this.activityService.log(
        'register',
        `${admin.name} registered via invite`,
        '#2DD4A8',
      );
    } catch (e) {
      this.logger.warn(`Activity log failed: ${(e as Error).message}`);
    }

    return { message: 'Account created successfully' };
  }

  // List invite tokens (paginated, newest first)
  async getInvites(page: number, limit: number) {
    const offset = (page - 1) * limit;

    const [data, countResult] = await Promise.all([
      this.db
        .select({
          id: schema.inviteTokens.id,
          token: schema.inviteTokens.token,
          used: schema.inviteTokens.used,
          expiresAt: schema.inviteTokens.expiresAt,
          createdAt: schema.inviteTokens.createdAt,
        })
        .from(schema.inviteTokens)
        .orderBy(desc(schema.inviteTokens.createdAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: sql<number>`count(*)` })
        .from(schema.inviteTokens),
    ]);

    return { data, total: Number(countResult[0]?.total ?? 0), page, limit };
  }

  private generateToken(userId: string, email: string) {
    return this.jwtService.sign({ sub: userId, email });
  }
}
