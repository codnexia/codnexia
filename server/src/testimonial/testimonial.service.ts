// Manages client testimonials stored in DB
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq, desc } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { ActivityService } from '../activity/activity.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialService {
  constructor(
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
    private readonly activityService: ActivityService,
  ) {}

  // Get published testimonials only (public)
  async findPublished() {
    return this.db
      .select()
      .from(schema.testimonials)
      .where(eq(schema.testimonials.published, true))
      .orderBy(desc(schema.testimonials.createdAt));
  }

  // Get all testimonials (admin)
  async findAll() {
    return this.db
      .select()
      .from(schema.testimonials)
      .orderBy(desc(schema.testimonials.updatedAt));
  }

  // Create a new testimonial
  async create(dto: CreateTestimonialDto) {
    const [testimonial] = await this.db
      .insert(schema.testimonials)
      .values({
        author: dto.author,
        company: dto.company,
        content: dto.content,
        published: dto.published ?? false,
      })
      .returning();

    await this.activityService.log('testimonial', `Added testimonial from "${dto.author}"`, '#4A9FF5');
    return testimonial;
  }

  // Update an existing testimonial by ID
  async update(id: string, dto: UpdateTestimonialDto) {
    const [testimonial] = await this.db
      .update(schema.testimonials)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(schema.testimonials.id, id))
      .returning();

    if (!testimonial) throw new NotFoundException('Testimonial not found');
    await this.activityService.log('testimonial', `Updated testimonial from "${testimonial.author}"`, '#F5A623');
    return testimonial;
  }

  // Delete a testimonial by ID
  async remove(id: string) {
    const [testimonial] = await this.db
      .delete(schema.testimonials)
      .where(eq(schema.testimonials.id, id))
      .returning();

    if (!testimonial) throw new NotFoundException('Testimonial not found');
    await this.activityService.log('testimonial', `Deleted testimonial from "${testimonial.author}"`, '#F56565');
    return { success: true };
  }

  // Count total testimonials
  async count() {
    const rows = await this.db.select().from(schema.testimonials);
    return rows.length;
  }
}
