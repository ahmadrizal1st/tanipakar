import { pgTable, uuid, jsonb, integer, timestamp } from 'drizzle-orm/pg-core';

export const konsultasi = pgTable('konsultasi', {
	id: uuid('id').defaultRandom().primaryKey(),
	fakta: jsonb('fakta').notNull(), // input user as JSON
	hasil: jsonb('hasil').notNull(), // ranked results as JSON
	rules_aktif: integer('rules_aktif'), // jumlah rules yang fired
	created_at: timestamp('created_at').defaultNow()
});
