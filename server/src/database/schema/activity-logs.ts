// Admin activity feed (login, content edits, uploads, etc.)
import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';

export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  action: varchar('action', { length: 100 }).notNull(),
  description: text('description').notNull(),
  color: varchar('color', { length: 20 }).default('#2DD4A8'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_activity_logs_created_at').on(table.createdAt),
]);
