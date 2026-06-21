import { infer } from '../src/lib/inference';
import type { Fakta } from '../src/lib/rules';

const faktaUji: Fakta = {
	luas: 12,
	matahari: 'penuh',
	air: 'mudah',
	tanah: 'subur',
	waktu: 'cukup',
	pengalaman: 'pemula',
	ada_anak: false,
	jumlah_anggota: 4,
	budget: 'sedang',
	tujuan_finansial: 'hemat',
	tujuan: 'konsumsi',
	ph: null,
	suhu_tanah: null,
	tekstur: null,
	drainase: null
};

console.log('=== Menjalankan Test Inference Engine ===');
const hasil = infer(faktaUji);

console.log('Skor Hasil Evaluasi:');
console.log(hasil.scores);

console.log('\nHasil Ranking:');
hasil.ranked.forEach((r, idx) => {
	console.log(`${idx + 1}. ${r.label}: ${r.score} (${r.level})`);
});

function assert(condition: boolean, message: string) {
	if (!condition) {
		throw new Error(message);
	}
}

// Assertions using correct mathematical accumulation from the rules table:
// R01 (+2 cabai/tomat/terong)
// R05 (+1 all)
// R07 (+1 tomat/terong/cabai)
// R10 (+1 all)
// R11 (+2 kangkung/daun_bawang, +1 cabai)
// R14 (+2 kangkung/daun_bawang)
// R16 (+2 cabai/tomat, +1 kangkung/daun_bawang)
// R18 (+2 cabai/daun_bawang/kangkung)
// R20 (+1 cabai/tomat/kangkung/daun_bawang)
//
// Total: Cabai = 11, Kangkung = 10, Daun Bawang = 10, Tomat = 8, Terong = 5
try {
	assert(hasil.scores.cabai === 11, `cabai score mismatch: expected 11, got ${hasil.scores.cabai}`);
	assert(
		hasil.scores.kangkung === 10,
		`kangkung score mismatch: expected 10, got ${hasil.scores.kangkung}`
	);
	assert(
		hasil.scores.daun_bawang === 10,
		`daun_bawang score mismatch: expected 10, got ${hasil.scores.daun_bawang}`
	);
	assert(hasil.scores.tomat === 8, `tomat score mismatch: expected 8, got ${hasil.scores.tomat}`);
	assert(
		hasil.scores.terong === 5,
		`terong score mismatch: expected 5, got ${hasil.scores.terong}`
	);

	// Verify ranking order (1st should be cabai, 2nd & 3rd are kangkung & daun_bawang in any order)
	assert(hasil.ranked[0].plant === 'cabai', `Rank 1 should be cabai, got ${hasil.ranked[0].plant}`);
	const rank2_3 = [hasil.ranked[1].plant, hasil.ranked[2].plant];
	assert(
		rank2_3.includes('kangkung') && rank2_3.includes('daun_bawang'),
		`Rank 2 and 3 should be kangkung and daun_bawang, got ${rank2_3.join(', ')}`
	);
	assert(hasil.ranked[3].plant === 'tomat', `Rank 4 should be tomat, got ${hasil.ranked[3].plant}`);
	assert(
		hasil.ranked[4].plant === 'terong',
		`Rank 5 should be terong, got ${hasil.ranked[4].plant}`
	);

	// Verify recommendation levels
	// Max score is 11.
	// Cabai (11/11 = 1.0) -> Sangat Direkomendasikan
	// Kangkung (10/11 = 0.909) -> Sangat Direkomendasikan
	// Daun Bawang (10/11 = 0.909) -> Sangat Direkomendasikan
	// Tomat (8/11 = 0.727) -> Sangat Direkomendasikan
	// Terong (5/11 = 0.454) -> Direkomendasikan
	assert(
		hasil.ranked[0].level === 'Sangat Direkomendasikan',
		`Cabai level mismatch: got ${hasil.ranked[0].level}`
	);
	assert(
		hasil.ranked[3].level === 'Sangat Direkomendasikan',
		`Tomat level mismatch: got ${hasil.ranked[3].level}`
	);
	assert(
		hasil.ranked[4].level === 'Direkomendasikan',
		`Terong level mismatch: got ${hasil.ranked[4].level}`
	);

	console.log('\n✅ Semua assertion sukses! Logika inference engine aman dan sesuai aturan pakar.');
} catch (e) {
	const err = e as Error;
	console.error('\n❌ Test gagal dengan error:', err.message);
	process.exit(1);
}
