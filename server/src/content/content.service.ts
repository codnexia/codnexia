// Manages content pages (hero, about, services, etc.) stored in DB
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq, desc, sql } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { ActivityService } from '../activity/activity.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

// Default pages seeded on first load if DB is empty
const DEFAULT_PAGES = [
  { name: 'Hero Section', status: 'Published', content: 'Welcome to Codnexia — we build digital products that scale.' },
  { name: 'About Codnexia', status: 'Published', content: 'A Nairobi-based digital agency crafting world-class web and mobile experiences.' },
  { name: 'Our Process', status: 'Draft', content: 'Discovery → Build → Test → Deploy — our proven 4-step process.' },
  { name: 'Services', status: 'Published', content: 'Web Apps, Mobile, SaaS, API Development, No-Code, AI Integration, Consulting.' },
  { name: 'Contact Info', status: 'Published', content: 'Get in touch at hello@codnexia.com or visit our Nairobi office.' },
];

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
    private readonly activityService: ActivityService,
  ) {}

  private seeding: Promise<void> | null = null;

  // Get paginated content pages, seed defaults if empty
  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    let [data, [{ total }]] = await Promise.all([
      this.db
        .select()
        .from(schema.contentPages)
        .orderBy(desc(schema.contentPages.updatedAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: sql<number>`count(*)` })
        .from(schema.contentPages),
    ]);

    // Seed default pages on first load (guard against concurrent calls)
    if (Number(total) === 0) {
      if (!this.seeding) {
        this.seeding = this.db
          .insert(schema.contentPages)
          .values(DEFAULT_PAGES)
          .then(() => { this.seeding = null; })
          .catch((e) => { this.seeding = null; throw e; });
      }
      await this.seeding;
      [data, [{ total }]] = await Promise.all([
        this.db
          .select()
          .from(schema.contentPages)
          .orderBy(desc(schema.contentPages.updatedAt))
          .limit(limit)
          .offset(offset),
        this.db
          .select({ total: sql<number>`count(*)` })
          .from(schema.contentPages),
      ]);
    }

    return { data, total: Number(total), page, limit };
  }

  // Create a new content page
  async create(dto: CreateContentDto) {
    const [page] = await this.db
      .insert(schema.contentPages)
      .values({
        name: dto.name,
        status: dto.status ?? 'Draft',
        content: dto.content ?? '',
      })
      .returning();

    try { await this.activityService.log('content', `Created section "${dto.name}"`, '#4A9FF5'); }
    catch (e) { this.logger.warn(`Activity log failed: ${(e as Error).message}`); }
    return page;
  }

  // Update an existing content page by ID
  async update(id: string, dto: UpdateContentDto) {
    const [page] = await this.db
      .update(schema.contentPages)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(schema.contentPages.id, id))
      .returning();

    if (!page) throw new NotFoundException('Content page not found');
    try { await this.activityService.log('content', `Updated "${page.name}" section`, '#F5A623'); }
    catch (e) { this.logger.warn(`Activity log failed: ${(e as Error).message}`); }
    return page;
  }

  // Delete a content page by ID
  async remove(id: string) {
    const [page] = await this.db
      .delete(schema.contentPages)
      .where(eq(schema.contentPages.id, id))
      .returning();

    if (!page) throw new NotFoundException('Content page not found');
    return { success: true };
  }

  // Count total pages using SQL count
  async count() {
    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.contentPages);
    return Number(count);
  }
}
