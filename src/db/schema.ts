import { pgTable, uuid, jsonb, integer, timestamp, varchar } from 'drizzle-orm/pg-core';

export const konsultasi = pgTable('konsultasi', {
	id: uuid('id').defaultRandom().primaryKey(),
	fakta: jsonb('fakta').notNull(), // input user as JSON
	hasil: jsonb('hasil').notNull(), // ranked results as JSON
	rules_aktif: integer('rules_aktif'), // jumlah rules yang fired
	session_id: varchar('session_id', { length: 255 }), // ID untuk filter riwayat "Milik Saya"
	created_at: timestamp('created_at').defaultNow()
});
