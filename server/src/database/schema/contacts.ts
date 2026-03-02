// Contact form submissions from the public site
import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';

export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }),
  service: varchar('service', { length: 255 }),
  budget: varchar('budget', { length: 100 }),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_contacts_created_at').on(table.createdAt),
]);
