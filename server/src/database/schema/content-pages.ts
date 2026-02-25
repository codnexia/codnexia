// Editable content sections for the site (hero, about, services, etc.)
import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const contentPages = pgTable('content_pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('Draft'),
  content: text('content').notNull().default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
