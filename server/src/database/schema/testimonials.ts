// Client testimonials displayed as floating popup on the public site
import { pgTable, uuid, varchar, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const testimonials = pgTable('testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  author: varchar('author', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  content: text('content').notNull(),
  published: boolean('published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_testimonials_published').on(table.published),
]);
