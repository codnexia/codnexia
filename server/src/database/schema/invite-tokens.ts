import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { admins } from './admins';

export const inviteTokens = pgTable('invite_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  token: varchar('token', { length: 64 }).notNull().unique(),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => admins.id),
  usedBy: uuid('used_by').references(() => admins.id),
  used: boolean('used').default(false).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
