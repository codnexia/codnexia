// Handles contact form submissions - save to DB and retrieve for admin
import { Inject, Injectable } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { desc } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { ActivityService } from '../activity/activity.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
    private readonly activityService: ActivityService,
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

    // Log this as activity for the admin dashboard
    await this.activityService.log('contact', `New contact from ${dto.name}`, '#2DD4A8');

    return contact;
  }

  // Get all contact submissions (newest first) for admin panel
  async findAll() {
    return this.db
      .select()
      .from(schema.contacts)
      .orderBy(desc(schema.contacts.createdAt));
  }

  // Get total count of submissions
  async count() {
    const rows = await this.db.select().from(schema.contacts);
    return rows.length;
  }
}
