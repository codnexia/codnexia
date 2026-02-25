// Handles media file uploads and metadata storage
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq, desc } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import { DRIZZLE } from '../database/database.module';
import * as schema from '../database/schema';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class MediaService {
  constructor(
    @Inject(DRIZZLE) private db: NeonHttpDatabase<typeof schema>,
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

    await this.activityService.log('upload', `Uploaded "${file.originalname}"`, '#4A9FF5');
    return media;
  }

  // Get all media files (newest first)
  async findAll() {
    return this.db
      .select()
      .from(schema.mediaFiles)
      .orderBy(desc(schema.mediaFiles.createdAt));
  }

  // Delete a media file from DB and disk
  async remove(id: string) {
    const [file] = await this.db
      .delete(schema.mediaFiles)
      .where(eq(schema.mediaFiles.id, id))
      .returning();

    if (!file) throw new NotFoundException('File not found');

    // Try to remove the actual file from disk
    const filePath = path.join(process.cwd(), 'uploads', file.name);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return { success: true };
  }

  // Count total files
  async count() {
    const rows = await this.db.select().from(schema.mediaFiles);
    return rows.length;
  }
}
