// Job positions managed by admin, displayed on the public careers page
import { pgTable, uuid, varchar, text, boolean, timestamp, integer, index } from 'drizzle-orm/pg-core';

export const jobPositions = pgTable('job_positions', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),       // Full-time, Part-time, Contract, etc.
  mode: varchar('mode', { length: 50 }).notNull(),        // Remote, Hybrid, On-site
  department: varchar('department', { length: 100 }),      // Engineering, Design, etc.
  description: text('description'),
  requirements: text('requirements'),        // AI screening context
  open: boolean('open').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_job_positions_open').on(table.open),
]);
