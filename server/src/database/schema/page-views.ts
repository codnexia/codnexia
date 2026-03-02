// Page view tracking for analytics (each visit logs a row)
import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';

export const pageViews = pgTable('page_views', {
  id: uuid('id').defaultRandom().primaryKey(),
  page: varchar('page', { length: 255 }).notNull(),
  sessionId: varchar('session_id', { length: 100 }).notNull(),
  device: varchar('device', { length: 50 }), // Desktop, Mobile, Tablet
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_page_views_session_id').on(table.sessionId),
  index('idx_page_views_created_at').on(table.createdAt),
]);
