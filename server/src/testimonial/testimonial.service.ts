// Manages client testimonials stored in DB
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq, desc, sql } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { ActivityService } from '../activity/activity.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { stripHtmlTags } from '../common/utils/sanitize';

@Injectable()
export class TestimonialService {
  private readonly logger = new Logger(TestimonialService.name);

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

  // Get paginated testimonials (admin)
  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [data, [{ total }]] = await Promise.all([
      this.db
        .select()
        .from(schema.testimonials)
        .orderBy(desc(schema.testimonials.updatedAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: sql<number>`count(*)` })
        .from(schema.testimonials),
    ]);
    return { data, total: Number(total), page, limit };
  }

  // Create a new testimonial
  async create(dto: CreateTestimonialDto) {
    const [testimonial] = await this.db
      .insert(schema.testimonials)
      .values({
        author: stripHtmlTags(dto.author),
        company: stripHtmlTags(dto.company),
        role: dto.role ? stripHtmlTags(dto.role) : '',
        content: stripHtmlTags(dto.content),
        rating: dto.rating ?? 5,
        published: dto.published ?? false,
      })
      .returning();

    try { await this.activityService.log('testimonial', `Added testimonial from "${dto.author}"`, '#4A9FF5'); }
    catch (e) { this.logger.warn(`Activity log failed: ${(e as Error).message}`); }
    return testimonial;
  }

  // Update an existing testimonial by ID
  async update(id: string, dto: UpdateTestimonialDto) {
    const sanitized = { ...dto };
    if (sanitized.author) sanitized.author = stripHtmlTags(sanitized.author);
    if (sanitized.company) sanitized.company = stripHtmlTags(sanitized.company);
    if (sanitized.role) sanitized.role = stripHtmlTags(sanitized.role);
    if (sanitized.content) sanitized.content = stripHtmlTags(sanitized.content);

    const [testimonial] = await this.db
      .update(schema.testimonials)
      .set({ ...sanitized, updatedAt: new Date() })
      .where(eq(schema.testimonials.id, id))
      .returning();

    if (!testimonial) throw new NotFoundException('Testimonial not found');
    try { await this.activityService.log('testimonial', `Updated testimonial from "${testimonial.author}"`, '#F5A623'); }
    catch (e) { this.logger.warn(`Activity log failed: ${(e as Error).message}`); }
    return testimonial;
  }

  // Delete a testimonial by ID
  async remove(id: string) {
    const [testimonial] = await this.db
      .delete(schema.testimonials)
      .where(eq(schema.testimonials.id, id))
      .returning();

    if (!testimonial) throw new NotFoundException('Testimonial not found');
    try { await this.activityService.log('testimonial', `Deleted testimonial from "${testimonial.author}"`, '#F56565'); }
    catch (e) { this.logger.warn(`Activity log failed: ${(e as Error).message}`); }
    return { success: true };
  }

  // Count total testimonials using SQL count
  async count() {
    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.testimonials);
    return Number(count);
  }
}
