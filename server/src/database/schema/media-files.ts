// Uploaded media file metadata (actual files stored in /uploads)
import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const mediaFiles = pgTable('media_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  size: integer('size').notNull(), // size in bytes
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  path: varchar('path', { length: 500 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
