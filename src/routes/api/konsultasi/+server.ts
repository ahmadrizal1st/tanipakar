import { json, type RequestHandler } from '@sveltejs/kit';
import { infer } from '$lib/inference';
import { db } from '$lib/db';
import { konsultasi } from '../../../db/schema';
import type { Fakta } from '$lib/rules';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const fakta: Fakta = await request.json();

		// Jalankan inference engine (forward chaining)
		const hasil = infer(fakta);

		// Simpan riwayat konsultasi ke database Neon secara resilient.
		// Jika database mati/tidak terhubung di lokal, konsultasi harus tetap berjalan.
		try {
			await db.insert(konsultasi).values({
				fakta,
				hasil,
				rules_aktif: hasil.firedRules.length
			});
		} catch (dbError) {
			// ponytail: fail-safe, log database error but do not block user recommendations
			console.error('Database logging failed, continuing with inference response:', dbError);
		}

		return json({ success: true, hasil });
	} catch (error: unknown) {
		const err = error as Error;
		console.error('API Error /api/konsultasi:', err);
		return json(
			{ success: false, message: err.message || 'Terjadi kesalahan sistem' },
			{ status: 500 }
		);
	}
};
