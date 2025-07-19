import { bigint, boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const currentSegment = pgTable('current_segment', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  isActive: boolean('is_active').notNull().default(false),
  segment: text('segment').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  url: text('url').notNull(),
});

export const redirectLogs = pgTable('redirect_logs', {
  createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
  id: uuid('id').defaultRandom().primaryKey(),
  redirectedUrl: text('redirected_url').notNull(),
  userAgent: text('user_agent'),
})