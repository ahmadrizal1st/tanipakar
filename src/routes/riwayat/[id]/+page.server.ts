import { error } from '@sveltejs/kit';
import { db } from '$lib/db';
import { konsultasi } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const riwayatPromise = db
		.select()
		.from(konsultasi)
		.where(eq(konsultasi.id, params.id))
		.limit(1)
		.then((res) => {
			if (!res || res.length === 0) {
				error(404, 'Riwayat konsultasi tidak ditemukan');
			}
			return res[0];
		})
		.catch((e) => {
			console.error('Failed to load detail riwayat:', e);
			error(500, 'Gagal memuat detail riwayat dari server');
		});

	return {
		streamed: {
			riwayat: riwayatPromise
		}
	};
};
