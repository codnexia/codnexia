// Handles contact form submissions - save to DB and retrieve for admin
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { desc, sql } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { ActivityService } from '../activity/activity.service';
import { MailService } from '../mail/mail.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
    private readonly activityService: ActivityService,
    private readonly mailService: MailService,
  ) {}

  // Save a new contact form submission
  async create(dto: CreateContactDto) {
    const [contact] = await this.db
      .insert(schema.contacts)
      .values({
        name: dto.name,
        email: dto.email,
        company: dto.company,
        service: dto.service,
        budget: dto.budget,
        message: dto.message,
      })
      .returning();

    // Log this as activity for the admin dashboard (non-blocking)
    try { await this.activityService.log('contact', `New contact from ${dto.name}`, '#2DD4A8'); }
    catch (e) { this.logger.warn(`Activity log failed: ${(e as Error).message}`); }

    // Send email notification (non-blocking — failure should not break the response)
    try {
      await this.mailService.sendContactNotification(dto);
    } catch (err) {
      this.logger.warn(`Failed to send contact email for ${dto.name}: ${(err as Error).message}`);
    }

    return contact;
  }

  // Get paginated contact submissions (newest first) for admin panel
  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [data, [{ total }]] = await Promise.all([
      this.db
        .select()
        .from(schema.contacts)
        .orderBy(desc(schema.contacts.createdAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: sql<number>`count(*)` })
        .from(schema.contacts),
    ]);
    return { data, total: Number(total), page, limit };
  }

  // Get total count of submissions using SQL count
  async count() {
    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.contacts);
    return Number(count);
  }
}
