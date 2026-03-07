// Portfolio projects displayed on the public site
import { pgTable, uuid, varchar, text, boolean, integer, timestamp, index } from 'drizzle-orm/pg-core';

export const portfolios = pgTable('portfolios', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  color: varchar('color', { length: 20 }).default('#2DD4A8').notNull(),
  tags: text('tags'),           // JSON array of tech tags
  metrics: text('metrics'),     // JSON array of {v, l} objects
  imageUrl: varchar('image_url', { length: 500 }),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  liveUrl: varchar('live_url', { length: 500 }),
  repoUrl: varchar('repo_url', { length: 500 }),
  featured: boolean('featured').default(false).notNull(),
  published: boolean('published').default(false).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_portfolios_published').on(table.published),
]);
