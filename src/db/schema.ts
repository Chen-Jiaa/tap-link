import { bigint, boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const currentSegment = pgTable('current_segment', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  isActive: boolean('is_active').notNull().default(false),
  segment: text('segment').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  url: text('url').notNull(),
});