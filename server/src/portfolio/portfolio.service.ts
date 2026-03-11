// Manages portfolio projects stored in DB with image optimization via sharp
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq, desc, asc, sql } from 'drizzle-orm';
import { promises as fs } from 'fs';
import * as path from 'path';
import sharp from 'sharp';

import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { ActivityService } from '../activity/activity.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
    private readonly activityService: ActivityService,
  ) {}

  // Get published portfolios only (public)
  async findPublished() {
    const rows = await this.db
      .select()
      .from(schema.portfolios)
      .where(eq(schema.portfolios.published, true))
      .orderBy(asc(schema.portfolios.sortOrder), desc(schema.portfolios.createdAt));

    return rows.map(this.serializeRow);
  }

  // Get paginated portfolios (admin)
  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [data, [{ total }]] = await Promise.all([
      this.db
        .select()
        .from(schema.portfolios)
        .orderBy(asc(schema.portfolios.sortOrder), desc(schema.portfolios.updatedAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: sql<number>`count(*)` })
        .from(schema.portfolios),
    ]);
    return { data: data.map(this.serializeRow), total: Number(total), page, limit };
  }

  // Create a new portfolio project
  async create(dto: CreatePortfolioDto) {
    const [portfolio] = await this.db
      .insert(schema.portfolios)
      .values({
        title: dto.title,
        subtitle: dto.subtitle,
        description: dto.description,
        category: dto.category,
        color: dto.color ?? '#2DD4A8',
        tags: dto.tags ? JSON.stringify(dto.tags) : null,
        metrics: dto.metrics ? JSON.stringify(dto.metrics) : null,
        liveUrl: dto.liveUrl ?? null,
        repoUrl: dto.repoUrl ?? null,
        featured: dto.featured ?? false,
        published: dto.published ?? false,
        sortOrder: dto.sortOrder ?? 0,
      })
      .returning();

    try { await this.activityService.log('portfolio', `Added portfolio "${dto.title}"`, '#4A9FF5'); }
    catch (e) { this.logger.warn(`Activity log failed: ${(e as Error).message}`); }
    return this.serializeRow(portfolio);
  }

  // Update an existing portfolio project by ID
  async update(id: string, dto: UpdatePortfolioDto) {
    const values: Record<string, unknown> = { updatedAt: new Date() };
    if (dto.title !== undefined) values.title = dto.title;
    if (dto.subtitle !== undefined) values.subtitle = dto.subtitle;
    if (dto.description !== undefined) values.description = dto.description;
    if (dto.category !== undefined) values.category = dto.category;
    if (dto.color !== undefined) values.color = dto.color;
    if (dto.tags !== undefined) values.tags = JSON.stringify(dto.tags);
    if (dto.metrics !== undefined) values.metrics = JSON.stringify(dto.metrics);
    if (dto.liveUrl !== undefined) values.liveUrl = dto.liveUrl;
    if (dto.repoUrl !== undefined) values.repoUrl = dto.repoUrl;
    if (dto.featured !== undefined) values.featured = dto.featured;
    if (dto.published !== undefined) values.published = dto.published;
    if (dto.sortOrder !== undefined) values.sortOrder = dto.sortOrder;

    const [portfolio] = await this.db
      .update(schema.portfolios)
      .set(values)
      .where(eq(schema.portfolios.id, id))
      .returning();

    if (!portfolio) throw new NotFoundException('Portfolio project not found');
    try { await this.activityService.log('portfolio', `Updated portfolio "${portfolio.title}"`, '#F5A623'); }
    catch (e) { this.logger.warn(`Activity log failed: ${(e as Error).message}`); }
    return this.serializeRow(portfolio);
  }

  // Delete a portfolio project by ID
  async remove(id: string) {
    const [portfolio] = await this.db
      .delete(schema.portfolios)
      .where(eq(schema.portfolios.id, id))
      .returning();

    if (!portfolio) throw new NotFoundException('Portfolio project not found');

    // Delete associated images from disk
    await this.deleteFileFromDisk(portfolio.imageUrl);
    await this.deleteFileFromDisk(portfolio.thumbnailUrl);

    try { await this.activityService.log('portfolio', `Deleted portfolio "${portfolio.title}"`, '#F56565'); }
    catch (e) { this.logger.warn(`Activity log failed: ${(e as Error).message}`); }
    return { success: true };
  }

  // Upload and optimize image with sharp
  async uploadImage(id: string, file: Express.Multer.File) {
    const [existing] = await this.db
      .select()
      .from(schema.portfolios)
      .where(eq(schema.portfolios.id, id));

    if (!existing) throw new NotFoundException('Portfolio project not found');

    // Delete old images if they exist
    await this.deleteFileFromDisk(existing.imageUrl);
    await this.deleteFileFromDisk(existing.thumbnailUrl);

    const timestamp = Date.now();
    const displayName = `portfolio-${timestamp}-display.webp`;
    const thumbName = `portfolio-${timestamp}-thumb.webp`;
    const uploadsDir = path.join(process.cwd(), 'uploads');

    // Generate display image: max 1200px wide, 80% quality WebP
    await sharp(file.path)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(uploadsDir, displayName));

    // Generate thumbnail: max 400px wide, 70% quality WebP
    await sharp(file.path)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 70 })
      .toFile(path.join(uploadsDir, thumbName));

    // Delete the original uploaded file
    try { await fs.unlink(file.path); }
    catch (e) { this.logger.warn(`Failed to delete original upload: ${(e as Error).message}`); }

    const [portfolio] = await this.db
      .update(schema.portfolios)
      .set({
        imageUrl: `/uploads/${displayName}`,
        thumbnailUrl: `/uploads/${thumbName}`,
        updatedAt: new Date(),
      })
      .where(eq(schema.portfolios.id, id))
      .returning();

    try { await this.activityService.log('portfolio', `Updated image for "${portfolio.title}"`, '#4A9FF5'); }
    catch (e) { this.logger.warn(`Activity log failed: ${(e as Error).message}`); }
    return this.serializeRow(portfolio);
  }

  // Remove image from a portfolio project
  async removeImage(id: string) {
    const [existing] = await this.db
      .select()
      .from(schema.portfolios)
      .where(eq(schema.portfolios.id, id));

    if (!existing) throw new NotFoundException('Portfolio project not found');

    await this.deleteFileFromDisk(existing.imageUrl);
    await this.deleteFileFromDisk(existing.thumbnailUrl);

    const [portfolio] = await this.db
      .update(schema.portfolios)
      .set({ imageUrl: null, thumbnailUrl: null, updatedAt: new Date() })
      .where(eq(schema.portfolios.id, id))
      .returning();

    return this.serializeRow(portfolio);
  }

  // Count total portfolio projects
  async count() {
    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.portfolios);
    return Number(count);
  }

  // Serialize a DB row: parse JSON fields for API response
  private serializeRow(row: typeof schema.portfolios.$inferSelect) {
    let tags: unknown[] = [];
    let metrics: unknown[] = [];
    try { tags = row.tags ? JSON.parse(row.tags) : []; }
    catch { this.logger.warn(`Invalid JSON in tags for portfolio ${row.id}`); }
    try { metrics = row.metrics ? JSON.parse(row.metrics) : []; }
    catch { this.logger.warn(`Invalid JSON in metrics for portfolio ${row.id}`); }
    return { ...row, tags, metrics };
  }

  // Delete a file from disk by its URL path
  private async deleteFileFromDisk(urlPath: string | null) {
    if (!urlPath) return;
    const filePath = path.join(process.cwd(), urlPath.replace(/^\//, ''));
    try { await fs.unlink(filePath); }
    catch (e) { this.logger.warn(`Failed to delete file from disk: ${(e as Error).message}`); }
  }
}
