import { db } from '$lib/db';
import { konsultasi } from '../../db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const riwayatList = await db.select().from(konsultasi).orderBy(desc(konsultasi.created_at));
		return { riwayatList };
	} catch (error) {
		console.error('Failed to fetch riwayat:', error);
		return { riwayatList: [] };
	}
};
