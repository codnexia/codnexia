// Handles media file uploads and metadata storage
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc, sql } from 'drizzle-orm';

import { promises as fs } from 'fs';
import * as path from 'path';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    private readonly activityService: ActivityService,
  ) {}

  // Save uploaded file metadata to DB
  async create(file: Express.Multer.File) {
    const [media] = await this.db
      .insert(schema.mediaFiles)
      .values({
        name: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        path: `/uploads/${file.filename}`,
      })
      .returning();

    try { await this.activityService.log('upload', `Uploaded "${file.originalname}"`, '#4A9FF5'); }
    catch (e) { this.logger.warn(`Activity log failed: ${(e as Error).message}`); }
    return media;
  }

  // Get paginated media files (newest first)
  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [data, [{ total }]] = await Promise.all([
      this.db
        .select()
        .from(schema.mediaFiles)
        .orderBy(desc(schema.mediaFiles.createdAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: sql<number>`count(*)` })
        .from(schema.mediaFiles),
    ]);
    return { data, total: Number(total), page, limit };
  }

  // Delete a media file from DB and disk
  async remove(id: string) {
    const [file] = await this.db
      .delete(schema.mediaFiles)
      .where(eq(schema.mediaFiles.id, id))
      .returning();

    if (!file) throw new NotFoundException('File not found');

    // Remove the actual file from disk (path-traversal safe)
    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    const filePath = path.resolve(uploadsDir, path.basename(file.name));
    if (!filePath.startsWith(uploadsDir)) {
      this.logger.error(`Blocked directory traversal attempt: ${file.name}`);
    } else {
      try { await fs.unlink(filePath); }
      catch (e) { this.logger.warn(`Failed to delete file from disk: ${(e as Error).message}`); }
    }

    return { success: true };
  }

  // Count total files using SQL count
  async count() {
    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.mediaFiles);
    return Number(count);
  }
}
