export interface PlantInfo {
	id: string;
	name: string;
	description: string;
	harvestTime: string;
	difficulty: 'Mudah' | 'Sedang' | 'Sulit';
	tips: string[];
}

export const plantsData: Record<string, PlantInfo> = {
	cabai: {
		id: 'cabai',
		name: 'Cabai',
		description:
			'Cabai merupakan tanaman bumbu masakan bernilai ekonomi tinggi. Cocok ditanam di tanah maupun pot, namun memerlukan pemantauan hama yang rutin.',
		harvestTime: '70 - 90 Hari',
		difficulty: 'Sedang',
		tips: [
			'Pastikan tanaman mendapat sinar matahari minimal 6 jam sehari.',
			'Gunakan media tanam yang gembur dan memiliki drainase baik.',
			'Periksa secara rutin untuk hama seperti kutu putih atau lalat buah.',
			'Siram secukupnya, hindari penyiraman berlebih yang bisa memicu jamur akar.'
		]
	},
	tomat: {
		id: 'tomat',
		name: 'Tomat',
		description:
			'Tomat adalah tanaman sayur buah yang kaya vitamin C. Sangat disukai karena bisa dikonsumsi langsung atau dijadikan bumbu.',
		harvestTime: '60 - 85 Hari',
		difficulty: 'Sedang',
		tips: [
			'Berikan ajir (tiang penyangga) agar batang tidak patah saat berbuah lebat.',
			'Pangkas tunas air (tunas ketiak) agar nutrisi fokus ke pembentukan buah.',
			'Jaga konsistensi penyiraman untuk mencegah buah pecah (cracking).',
			'Pilih varietas tomat ceri atau rampai jika ditanam di pot berukuran kecil.'
		]
	},
	terong: {
		id: 'terong',
		name: 'Terong',
		description:
			'Terong adalah sayuran buah yang mudah dibudidayakan di dataran rendah hingga menengah. Memiliki daun lebar dan rakus nutrisi.',
		harvestTime: '70 - 80 Hari',
		difficulty: 'Sedang',
		tips: [
			'Berikan pupuk kandang yang cukup pada media tanam awal.',
			'Bersihkan gulma di sekitar tanaman secara berkala.',
			'Gunakan mulsa (jika di lahan terbuka) untuk menjaga kelembaban tanah.',
			'Lakukan pemanenan sebelum buah terlalu tua (kulit masih mengkilap).'
		]
	},
	kangkung: {
		id: 'kangkung',
		name: 'Kangkung',
		description:
			'Kangkung adalah sayuran daun yang pertumbuhannya sangat cepat. Sangat toleran terhadap kelebihan air dan minim perawatan.',
		harvestTime: '25 - 30 Hari',
		difficulty: 'Mudah',
		tips: [
			'Sangat cocok bagi pemula karena tingkat keberhasilannya hampir 100%.',
			'Bisa dipanen dengan cara dicabut atau dipotong sisakan 3-5 cm agar tumbuh kembali.',
			'Pastikan kebutuhan air selalu tercukupi (tidak boleh kekeringan).',
			'Pemberian pupuk nitrogen organik (seperti POC kotoran hewan) mempercepat panen.'
		]
	},
	daun_bawang: {
		id: 'daun_bawang',
		name: 'Daun Bawang',
		description:
			'Daun bawang merupakan bumbu pelengkap masakan yang wajib ada. Mudah tumbuh di pot dan toleran terhadap minim sinar matahari.',
		harvestTime: '45 - 60 Hari',
		difficulty: 'Mudah',
		tips: [
			'Bisa ditanam dari sisa potongan akar daun bawang yang dibeli di pasar.',
			'Gunakan media tanam lempung berpasir agar umbi tidak busuk.',
			'Jangan menyiram terlalu basah di musim hujan.',
			'Lakukan pembubunan (menimbun pangkal batang) agar bagian putih daun bawang lebih panjang.'
		]
	}
};
