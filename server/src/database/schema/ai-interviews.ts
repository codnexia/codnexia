// AI interview sessions linked to career applications
import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, index } from 'drizzle-orm/pg-core';
import { careerApplications } from './career-applications';

export const aiInterviews = pgTable('ai_interviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  applicationId: uuid('application_id').notNull().references(() => careerApplications.id, { onDelete: 'cascade' }),
  accessToken: varchar('access_token', { length: 128 }).notNull().unique(),
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, in_progress, completed, expired
  questions: jsonb('questions').$type<{ category: string; question: string }[]>().default([]),
  answers: jsonb('answers').$type<{ questionIndex: number; answer: string; submittedAt: string }[]>().default([]),
  currentQuestionIndex: integer('current_question_index').default(0),
  evaluationScore: integer('evaluation_score'),
  evaluationNotes: text('evaluation_notes'),
  evaluationRecommendation: varchar('evaluation_recommendation', { length: 50 }),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_ai_interviews_application_id').on(table.applicationId),
  index('idx_ai_interviews_access_token').on(table.accessToken),
  index('idx_ai_interviews_status').on(table.status),
]);
