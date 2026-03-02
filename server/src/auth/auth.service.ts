import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { ActivityService } from '../activity/activity.service';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
    private readonly activityService: ActivityService,
  ) {}

  async login(dto: LoginDto) {
    const [user] = await this.db
      .select()
      .from(schema.admins)
      .where(eq(schema.admins.email, dto.email));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

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

  private generateToken(userId: string, email: string) {
    return this.jwtService.sign({ sub: userId, email });
  }
}
