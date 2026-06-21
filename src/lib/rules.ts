export interface Fakta {
	luas: number;
	matahari: 'penuh' | 'sebagian' | 'teduh';
	air: 'mudah' | 'terbatas';
	tanah: 'subur' | 'pot';
	waktu: 'sibuk' | 'cukup';
	pengalaman: 'pemula' | 'berpengalaman';
	ada_anak: boolean;
	jumlah_anggota: number;
	budget: 'rendah' | 'sedang' | 'tinggi';
	tujuan_finansial: 'hemat' | 'jual';
	tujuan: 'konsumsi' | 'estetika' | 'edukasi' | 'pangan' | 'bisnis';

	// Kualitas tanah — opsional, null jika tidak diisi
	ph: number | null;
	suhu_tanah: number | null;
	tekstur: 'lempung_berpasir' | 'lempung' | 'pasir' | 'liat' | null;
	drainase: 'baik' | 'sedang' | 'buruk' | null;
}

export const PLANTS = ['cabai', 'tomat', 'terong', 'kangkung', 'daun_bawang'] as const;
export type Plant = (typeof PLANTS)[number];

export const PLANT_LABELS: Record<Plant, string> = {
	cabai: 'Cabai',
	tomat: 'Tomat',
	terong: 'Terong',
	kangkung: 'Kangkung',
	daun_bawang: 'Daun Bawang'
};

export interface Rule {
	id: string;
	category: 'lingkungan' | 'kualitas_tanah' | 'pemilik' | 'keuangan' | 'tujuan';
	condition: (fakta: Fakta) => boolean;
	score: Partial<Record<Plant, number>>;
	alasan: string;
}

export const rules: Rule[] = [
	// 1. Kondisi Lingkungan (Wajib)
	{
		id: 'R01',
		category: 'lingkungan',
		condition: (f) => f.luas >= 10 && f.matahari === 'penuh',
		score: { cabai: 2, tomat: 2, terong: 2 },
		alasan:
			'Luas pekarangan memadai (≥ 10m²) dan mendapat sinar matahari penuh, sangat ideal untuk cabai, tomat, dan terong.'
	},
	{
		id: 'R02',
		category: 'lingkungan',
		condition: (f) => f.luas < 10 && f.matahari === 'penuh',
		score: { cabai: 2, daun_bawang: 1 },
		alasan:
			'Pekarangan terbatas (< 10m²) dengan matahari penuh cocok untuk tanaman pot seperti cabai dan daun bawang.'
	},
	{
		id: 'R03',
		category: 'lingkungan',
		condition: (f) => f.matahari === 'sebagian',
		score: { kangkung: 2, daun_bawang: 2 },
		alasan:
			'Sinar matahari sebagian (3–6 jam) cukup optimal untuk pertumbuhan kangkung dan daun bawang.'
	},
	{
		id: 'R04',
		category: 'lingkungan',
		condition: (f) => f.matahari === 'teduh',
		score: { kangkung: 1 },
		alasan:
			'Sinar matahari minim (<3 jam) membatasi pilihan, kangkung adalah yang paling toleran terhadap kondisi teduh.'
	},
	{
		id: 'R05',
		category: 'lingkungan',
		condition: (f) => f.air === 'mudah',
		score: { cabai: 1, tomat: 1, terong: 1, kangkung: 1, daun_bawang: 1 },
		alasan: 'Ketersediaan air yang mudah mendukung pertumbuhan semua jenis tanaman.'
	},
	{
		id: 'R06',
		category: 'lingkungan',
		condition: (f) => f.air === 'terbatas',
		score: { cabai: 1, daun_bawang: 1 },
		alasan:
			'Air terbatas (hanya hujan) membuat tanaman tahan kering seperti cabai dan daun bawang lebih direkomendasikan.'
	},
	{
		id: 'R07',
		category: 'lingkungan',
		condition: (f) => f.tanah === 'subur',
		score: { tomat: 1, terong: 1, cabai: 1 },
		alasan:
			'Penanaman langsung di tanah langsung sangat baik untuk tanaman dengan akar lebih dalam seperti tomat, terong, dan cabai.'
	},
	{
		id: 'R08',
		category: 'lingkungan',
		condition: (f) => f.tanah === 'pot',
		score: { cabai: 2, daun_bawang: 2, kangkung: 1 },
		alasan:
			'Penanaman di pot/polybag cocok untuk cabai, daun bawang, dan kangkung karena fleksibilitas ruang.'
	},

	// 1. Kondisi Lingkungan (Opsional Kualitas Tanah)
	// pH Tanah
	{
		id: 'R_PH1',
		category: 'kualitas_tanah',
		condition: (f) => f.ph !== null && f.ph >= 6.0 && f.ph <= 6.5,
		score: { cabai: 2, tomat: 2, kangkung: 1 },
		alasan: 'pH tanah 6.0–6.5 optimal untuk penyerapan nutrisi cabai, tomat, dan kangkung.'
	},
	{
		id: 'R_PH2',
		category: 'kualitas_tanah',
		condition: (f) => f.ph !== null && f.ph >= 6.5 && f.ph <= 7.0,
		score: { tomat: 2, terong: 2, daun_bawang: 1 },
		alasan: 'pH tanah 6.5–7.0 ideal untuk tomat, terong, dan daun bawang.'
	},
	{
		id: 'R_PH3',
		category: 'kualitas_tanah',
		condition: (f) => f.ph !== null && f.ph < 5.5,
		score: { kangkung: 2 },
		alasan:
			'Tanah sangat asam (pH < 5.5) kurang ideal bagi sebagian besar tanaman, namun kangkung memiliki toleransi keasaman tertinggi.'
	},
	{
		id: 'R_PH4',
		category: 'kualitas_tanah',
		condition: (f) => f.ph !== null && f.ph > 7.5,
		score: { daun_bawang: 1 },
		alasan:
			'Tanah cenderung basa (pH > 7.5) kurang ramah tanaman sayuran, daun bawang adalah yang paling toleran terhadap kondisi ini.'
	},

	// Suhu Tanah
	{
		id: 'R_SU1',
		category: 'kualitas_tanah',
		condition: (f) => f.suhu_tanah !== null && f.suhu_tanah >= 20 && f.suhu_tanah <= 25,
		score: { kangkung: 2, daun_bawang: 2 },
		alasan: 'Suhu tanah sejuk (20–25°C) optimal bagi kangkung dan daun bawang.'
	},
	{
		id: 'R_SU2',
		category: 'kualitas_tanah',
		condition: (f) => f.suhu_tanah !== null && f.suhu_tanah >= 25 && f.suhu_tanah <= 30,
		score: { cabai: 2, tomat: 2, terong: 2 },
		alasan:
			'Suhu tanah hangat (25–30°C) mempercepat pertumbuhan vegetatif cabai, tomat, dan terong.'
	},
	{
		id: 'R_SU3',
		category: 'kualitas_tanah',
		condition: (f) => f.suhu_tanah !== null && f.suhu_tanah > 32,
		score: { cabai: 1 },
		alasan:
			'Suhu tanah sangat panas (> 32°C) rentan membuat tanaman layu, tetapi cabai paling adaptif terhadap suhu panas.'
	},
	{
		id: 'R_SU4',
		category: 'kualitas_tanah',
		condition: (f) => f.suhu_tanah !== null && f.suhu_tanah < 18,
		score: { daun_bawang: 1 },
		alasan:
			'Suhu tanah dingin (< 18°C) membatasi aktivitas mikroba, daun bawang paling toleran terhadap suhu rendah.'
	},

	// Tekstur Tanah
	{
		id: 'R_TX1',
		category: 'kualitas_tanah',
		condition: (f) => f.tekstur === 'lempung_berpasir',
		score: { cabai: 2, tomat: 2, terong: 1 },
		alasan:
			'Tekstur lempung berpasir menyediakan aerasi akar dan drainase yang baik untuk cabai, tomat, dan terong.'
	},
	{
		id: 'R_TX2',
		category: 'kualitas_tanah',
		condition: (f) => f.tekstur === 'lempung',
		score: { cabai: 1, tomat: 1, terong: 1, kangkung: 1, daun_bawang: 1 },
		alasan:
			'Tekstur lempung merupakan tanah paling ideal untuk menahan air dan nutrisi bagi semua jenis tanaman.'
	},
	{
		id: 'R_TX3',
		category: 'kualitas_tanah',
		condition: (f) => f.tekstur === 'pasir',
		score: { cabai: 1, daun_bawang: 1 },
		alasan:
			'Tekstur berpasir memiliki drainase cepat dan kurang nutrisi, namun cabai dan daun bawang masih bisa tumbuh dengan pemupukan rutin.'
	},
	{
		id: 'R_TX4',
		category: 'kualitas_tanah',
		condition: (f) => f.tekstur === 'liat',
		score: { kangkung: 2 },
		alasan:
			'Tekstur tanah liat yang padat menyimpan banyak air, kangkung sangat menyukai kelembaban tinggi ini.'
	},

	// Drainase Tanah
	{
		id: 'R_DR1',
		category: 'kualitas_tanah',
		condition: (f) => f.drainase === 'baik',
		score: { cabai: 2, tomat: 2, terong: 1 },
		alasan: 'Drainase yang baik menghindarkan pembusukan akar pada cabai, tomat, dan terong.'
	},
	{
		id: 'R_DR2',
		category: 'kualitas_tanah',
		condition: (f) => f.drainase === 'sedang',
		score: { cabai: 1, tomat: 1, terong: 1, kangkung: 1, daun_bawang: 1 },
		alasan: 'Drainase sedang aman untuk mendukung pertumbuhan umum seluruh tanaman.'
	},
	{
		id: 'R_DR3',
		category: 'kualitas_tanah',
		condition: (f) => f.drainase === 'buruk',
		score: { kangkung: 3 },
		alasan:
			'Drainase buruk/tergenang mematikan sebagian besar tanaman, tetapi sangat disukai kangkung yang tumbuh subur di air tenang.'
	},

	// 2. Kondisi Pemilik (Wajib)
	{
		id: 'R09',
		category: 'pemilik',
		condition: (f) => f.waktu === 'sibuk',
		score: { kangkung: 2, daun_bawang: 2 },
		alasan:
			'Waktu perawatan terbatas (<30 menit) cocok untuk kangkung dan daun bawang yang minim perawatan (low-maintenance).'
	},
	{
		id: 'R10',
		category: 'pemilik',
		condition: (f) => f.waktu === 'cukup',
		score: { cabai: 1, tomat: 1, terong: 1, kangkung: 1, daun_bawang: 1 },
		alasan:
			'Waktu perawatan cukup (>30 menit) memungkinkan pemeliharaan optimal untuk semua tanaman.'
	},
	{
		id: 'R11',
		category: 'pemilik',
		condition: (f) => f.pengalaman === 'pemula',
		score: { kangkung: 2, daun_bawang: 2, cabai: 1 },
		alasan:
			'Bagi pemula, kangkung dan daun bawang adalah tanaman termudah untuk berhasil tumbuh tanpa keahlian khusus.'
	},
	{
		id: 'R12',
		category: 'pemilik',
		condition: (f) => f.pengalaman === 'berpengalaman',
		score: { cabai: 1, tomat: 2, terong: 2 },
		alasan:
			'Pemilik berpengalaman memiliki kapasitas merawat tanaman yang lebih sensitif terhadap hama seperti tomat dan terong.'
	},
	{
		id: 'R13',
		category: 'pemilik',
		condition: (f) => f.ada_anak === true,
		score: { tomat: 2, kangkung: 1 },
		alasan:
			'Adanya anak kecil membuat tanaman yang aman (tidak berduri/pedas) seperti tomat ceri dan kangkung cocok untuk edukasi mereka.'
	},
	{
		id: 'R14',
		category: 'pemilik',
		condition: (f) => f.jumlah_anggota >= 4,
		score: { kangkung: 2, daun_bawang: 2 },
		alasan:
			'Jumlah anggota keluarga besar (≥ 4) membutuhkan tanaman dengan siklus panen cepat dan produktivitas tinggi seperti kangkung.'
	},

	// 3. Kondisi Keuangan (Wajib)
	{
		id: 'R15',
		category: 'keuangan',
		condition: (f) => f.budget === 'rendah',
		score: { kangkung: 3, daun_bawang: 3 },
		alasan:
			'Budget rendah (< 200rb) sangat cocok untuk benih kangkung dan daun bawang yang murah serta minim kebutuhan pupuk khusus.'
	},
	{
		id: 'R16',
		category: 'keuangan',
		condition: (f) => f.budget === 'sedang',
		score: { cabai: 2, tomat: 2, kangkung: 1, daun_bawang: 1 },
		alasan:
			'Budget sedang (200rb–500rb) memadai untuk membeli benih berkualitas, polybag, dan pupuk dasar cabai serta tomat.'
	},
	{
		id: 'R17',
		category: 'keuangan',
		condition: (f) => f.budget === 'tinggi',
		score: { cabai: 2, tomat: 2, terong: 3 },
		alasan:
			'Budget tinggi (> 500rb) memungkinkan instalasi pot premium, media tanam khusus, dan nutrisi lengkap untuk terong, cabai, dan tomat.'
	},
	{
		id: 'R18',
		category: 'keuangan',
		condition: (f) => f.tujuan_finansial === 'hemat',
		score: { cabai: 2, daun_bawang: 2, kangkung: 2 },
		alasan:
			'Menanam cabai dan daun bawang di rumah memberikan penghematan belanja harian yang sangat terasa.'
	},
	{
		id: 'R19',
		category: 'keuangan',
		condition: (f) => f.tujuan_finansial === 'jual',
		score: { cabai: 3, tomat: 3 },
		alasan:
			'Cabai dan tomat memiliki nilai pasar yang tinggi dan konstan, sangat potensial untuk dijual kembali.'
	},

	// 4. Tujuan (Wajib)
	{
		id: 'R20',
		category: 'tujuan',
		condition: (f) => f.tujuan === 'konsumsi',
		score: { cabai: 1, tomat: 1, kangkung: 1, daun_bawang: 1 },
		alasan:
			'Tanaman konsumsi harian seperti cabai, tomat, kangkung, dan daun bawang memenuhi kebutuhan dapur langsung.'
	},
	{
		id: 'R21',
		category: 'tujuan',
		condition: (f) => f.tujuan === 'estetika',
		score: { cabai: 2, tomat: 2 },
		alasan:
			'Tanaman cabai hias (cabai pelangi) atau tomat buah memberikan nilai estetika visual yang cantik di pekarangan.'
	},
	{
		id: 'R22',
		category: 'tujuan',
		condition: (f) => f.tujuan === 'edukasi',
		score: { kangkung: 3, tomat: 1 },
		alasan:
			'Pertumbuhan cepat kangkung (panen ~25 hari) sangat bagus untuk media edukasi bercocok tanam yang interaktif bagi anak-anak.'
	},
	{
		id: 'R23',
		category: 'tujuan',
		condition: (f) => f.tujuan === 'pangan',
		score: { kangkung: 2, daun_bawang: 2, cabai: 1, tomat: 1 },
		alasan: 'Sayuran cepat tumbuh mendukung ketahanan pangan mandiri keluarga.'
	},
	{
		id: 'R24',
		category: 'tujuan',
		condition: (f) => f.tujuan === 'bisnis',
		score: { cabai: 3, tomat: 3, terong: 1 },
		alasan:
			'Komoditas cabai, tomat, dan terong memiliki permintaan tinggi di pasar lokal/warung terdekat.'
	}
];
