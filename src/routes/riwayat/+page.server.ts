import { db } from '$lib/db';
import { konsultasi } from '../../db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Tidak menggunakan await secara langsung agar SvelteKit melakukan Streaming Promise
	// Halaman akan langsung memuat, dan data menyusul tanpa memblokir navigasi.
	return {
		streamed: {
			riwayatList: db
				.select()
				.from(konsultasi)
				.orderBy(desc(konsultasi.created_at))
				.then((res) => res)
				.catch((error) => {
					console.error('Failed to fetch riwayat:', error);
					return [];
				})
		}
	};
};
