<script lang="ts">
	import { goto } from '$app/navigation';

	let step = $state(1);
	let loading = $state(false);
	let errorMsg = $state('');

	// State Fakta
	let luas = $state<number>(10);
	let matahari = $state<'penuh' | 'sebagian' | 'teduh' | ''>('');
	let air = $state<'mudah' | 'terbatas' | ''>('');
	let tanah = $state<'subur' | 'pot' | ''>('');

	// Kualitas Tanah (Opsional)
	let ph = $state<number | null>(null);
	let suhu_tanah = $state<number | null>(null);
	let tekstur = $state<'lempung_berpasir' | 'lempung' | 'pasir' | 'liat' | ''>('');
	let drainase = $state<'baik' | 'sedang' | 'buruk' | ''>('');

	// Pemilik
	let waktu = $state<'sibuk' | 'cukup' | ''>('');
	let pengalaman = $state<'pemula' | 'berpengalaman' | ''>('');
	let ada_anak = $state<boolean>(false);
	let jumlah_anggota = $state<number>(1);

	// Keuangan
	let budget = $state<'rendah' | 'sedang' | 'tinggi' | ''>('');
	let tujuan_finansial = $state<'hemat' | 'jual' | ''>('');

	// Tujuan
	let tujuan = $state<'konsumsi' | 'estetika' | 'edukasi' | 'pangan' | 'bisnis' | ''>('');

	function validateStep(s: number): boolean {
		errorMsg = '';
		if (s === 1) {
			if (luas === null || luas === undefined || luas <= 0) {
				errorMsg = 'Luas pekarangan harus berupa angka positif.';
				return false;
			}
			if (!matahari) {
				errorMsg = 'Silakan pilih kondisi sinar matahari.';
				return false;
			}
			if (!air) {
				errorMsg = 'Silakan pilih ketersediaan air.';
				return false;
			}
			if (!tanah) {
				errorMsg = 'Silakan pilih jenis media tanam.';
				return false;
			}
			if (ph !== null && (ph < 0 || ph > 14)) {
				errorMsg = 'pH tanah harus berada di rentang 0 - 14.';
				return false;
			}
			if (suhu_tanah !== null && (suhu_tanah < -10 || suhu_tanah > 60)) {
				errorMsg = 'Suhu tanah harus bernilai logis (-10 hingga 60°C).';
				return false;
			}
		} else if (s === 2) {
			if (!waktu) {
				errorMsg = 'Silakan pilih waktu perawatan Anda.';
				return false;
			}
			if (!pengalaman) {
				errorMsg = 'Silakan pilih tingkat pengalaman bertani Anda.';
				return false;
			}
			if (jumlah_anggota === null || jumlah_anggota === undefined || jumlah_anggota < 1) {
				errorMsg = 'Jumlah anggota keluarga minimal 1 orang.';
				return false;
			}
		} else if (s === 3) {
			if (!budget) {
				errorMsg = 'Silakan pilih estimasi budget yang tersedia.';
				return false;
			}
			if (!tujuan_finansial) {
				errorMsg = 'Silakan pilih prioritas keuangan Anda.';
				return false;
			}
		} else if (s === 4) {
			if (!tujuan) {
				errorMsg = 'Silakan pilih tujuan utama penanaman.';
				return false;
			}
		}
		return true;
	}

	function nextStep() {
		if (validateStep(step)) {
			step += 1;
		}
	}

	function prevStep() {
		errorMsg = '';
		if (step > 1) {
			step -= 1;
		}
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validateStep(4)) return;

		loading = true;
		errorMsg = '';

		const payload = {
			luas,
			matahari,
			air,
			tanah,
			ph: ph === null || ph === undefined || isNaN(ph) ? null : ph,
			suhu_tanah:
				suhu_tanah === null || suhu_tanah === undefined || isNaN(suhu_tanah) ? null : suhu_tanah,
			tekstur: tekstur || null,
			drainase: drainase || null,
			waktu,
			pengalaman,
			ada_anak,
			jumlah_anggota,
			budget,
			tujuan_finansial,
			tujuan
		};

		try {
			const res = await fetch('/api/konsultasi', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || 'Terjadi kesalahan pada server');
			}

			const data = await res.json();
			// Simpan fakta & hasil ke sessionStorage agar bisa diakses di halaman hasil
			sessionStorage.setItem('tanipakar_fakta', JSON.stringify(payload));
			sessionStorage.setItem('tanipakar_hasil', JSON.stringify(data.hasil));

			goto('/hasil');
		} catch (err: unknown) {
			const error = err as Error;
			errorMsg = error.message || 'Gagal mengirim konsultasi. Silakan coba lagi.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
	<!-- Header Panel - Minimal & Professional -->
	<div class="bg-base-100 border-b border-base-300 p-8 text-center">
		<h1 class="text-2xl font-bold tracking-tight text-base-content">Formulir Konsultasi Tanaman</h1>
		<p class="text-sm mt-2 text-base-content/60 max-w-md mx-auto">
			Isi parameter di bawah ini untuk mendapatkan rekomendasi tanaman pekarangan yang paling sesuai
			dengan kondisi dan kebutuhan Anda.
		</p>
	</div>

	<!-- Steps Progress Bar -->
	<div class="px-6 pt-6">
		<ul class="steps steps-horizontal w-full">
			<li class="step {step >= 1 ? 'step-primary font-semibold' : ''} text-xs md:text-sm">
				Lingkungan
			</li>
			<li class="step {step >= 2 ? 'step-primary font-semibold' : ''} text-xs md:text-sm">
				Pemilik
			</li>
			<li class="step {step >= 3 ? 'step-primary font-semibold' : ''} text-xs md:text-sm">
				Keuangan
			</li>
			<li class="step {step >= 4 ? 'step-primary font-semibold' : ''} text-xs md:text-sm">
				Tujuan
			</li>
		</ul>
	</div>

	<!-- Form Wizard Content -->
	<form onsubmit={handleSubmit} class="p-6 space-y-6">
		<!-- Error Alert -->
		{#if errorMsg}
			<div class="alert alert-error shadow-sm py-3 rounded-lg">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current shrink-0 h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span class="text-sm">{errorMsg}</span>
			</div>
		{/if}

		{#if step === 1}
			<!-- STEP 1: KONDISI LINGKUNGAN -->
			<div class="space-y-4">
				<h2
					class="text-lg font-bold border-b border-base-200 pb-2 text-base-content flex items-center gap-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-primary"
						><path
							d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"
						/><circle cx="12" cy="10" r="3" /></svg
					>
					<span>Langkah 1: Kondisi Lingkungan & Pekarangan</span>
				</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Luas Pekarangan -->
					<div class="form-control w-full">
						<label class="label font-semibold" for="input-luas">
							<span class="label-text">Luas Pekarangan (m²)</span>
						</label>
						<input
							type="number"
							id="input-luas"
							bind:value={luas}
							min="1"
							class="input input-bordered w-full"
							placeholder="Contoh: 15"
						/>
						<label class="label" for="input-luas">
							<span class="label-text-alt opacity-60">Masukkan estimasi luas area tanam Anda.</span>
						</label>
					</div>

					<!-- Sinar Matahari -->
					<div class="form-control w-full">
						<label class="label font-semibold" for="select-matahari">
							<span class="label-text">Paparan Sinar Matahari</span>
						</label>
						<select
							id="select-matahari"
							bind:value={matahari}
							class="select select-bordered w-full"
						>
							<option value="" disabled>Pilih durasi sinar matahari</option>
							<option value="penuh">Penuh (&gt;6 jam sehari)</option>
							<option value="sebagian">Sebagian (3 - 6 jam sehari)</option>
							<option value="teduh">Teduh (&lt;3 jam sehari)</option>
						</select>
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Sumber Air -->
					<div class="form-control w-full">
						<label class="label font-semibold" for="select-air">
							<span class="label-text">Ketersediaan Air</span>
						</label>
						<select id="select-air" bind:value={air} class="select select-bordered w-full">
							<option value="" disabled>Pilih kemudahan air</option>
							<option value="mudah">Mudah (Air mengalir lancar / ada keran)</option>
							<option value="terbatas"
								>Terbatas (Hanya mengandalkan air hujan / air sumur terbatas)</option
							>
						</select>
					</div>

					<!-- Media Tanam / Tanah -->
					<div class="form-control w-full">
						<label class="label font-semibold" for="select-tanah">
							<span class="label-text">Rencana Media Tanam</span>
						</label>
						<select id="select-tanah" bind:value={tanah} class="select select-bordered w-full">
							<option value="" disabled>Pilih media tanam</option>
							<option value="subur">Tanah Langsung (Pekarangan subur / bedengan)</option>
							<option value="pot">Dalam Pot / Polybag / Vertikultur</option>
						</select>
					</div>
				</div>

				<!-- Bagian Kualitas Tanah (Opsional) -->
				<div class="collapse collapse-plus border border-base-300 bg-base-200/40 rounded-lg mt-4">
					<input type="checkbox" id="toggle-opsional" />
					<label
						class="collapse-title text-sm font-semibold flex items-center gap-2 cursor-pointer"
						for="toggle-opsional"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="text-primary"
							><path
								d="M10 2v7.513a8 8 0 0 0 3 6.487l3 2.5a1 1 0 0 1-.5 1.5H8.5a1 1 0 0 1-.5-1.5l3-2.5a8 8 0 0 0 3-6.487V2"
							/><path d="M6 2h12" /><path d="M14 10h4" /></svg
						>
						<span>Spesifikasi Kualitas Tanah (Opsional)</span>
					</label>
					<div class="collapse-content space-y-4 pt-2">
						<p class="text-xs opacity-60">
							Isi bagian ini hanya jika Anda memiliki data atau alat ukur tanah. Jika dikosongkan,
							parameter kualitas tanah ini akan dilewati secara aman.
						</p>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<!-- pH Tanah -->
							<div class="form-control w-full">
								<label class="label" for="input-ph">
									<span class="label-text">pH Tanah</span>
								</label>
								<input
									type="number"
									id="input-ph"
									bind:value={ph}
									min="0"
									max="14"
									step="0.1"
									class="input input-bordered w-full text-sm"
									placeholder="Contoh: 6.5"
								/>
							</div>

							<!-- Suhu Tanah -->
							<div class="form-control w-full">
								<label class="label" for="input-suhu">
									<span class="label-text">Suhu Tanah (°C)</span>
								</label>
								<input
									type="number"
									id="input-suhu"
									bind:value={suhu_tanah}
									step="0.5"
									class="input input-bordered w-full text-sm"
									placeholder="Contoh: 26.5"
								/>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<!-- Tekstur Tanah -->
							<div class="form-control w-full">
								<label class="label" for="select-tekstur">
									<span class="label-text">Tekstur Tanah</span>
								</label>
								<select
									id="select-tekstur"
									bind:value={tekstur}
									class="select select-bordered w-full text-sm"
								>
									<option value="">Tidak Diketahui / Lewati</option>
									<option value="lempung_berpasir">Lempung Berpasir</option>
									<option value="lempung">Lempung (Gembur)</option>
									<option value="pasir">Berpasir</option>
									<option value="liat">Tanah Liat (Padat)</option>
								</select>
							</div>

							<!-- Drainase Tanah -->
							<div class="form-control w-full">
								<label class="label" for="select-drainase">
									<span class="label-text">Kondisi Drainase</span>
								</label>
								<select
									id="select-drainase"
									bind:value={drainase}
									class="select select-bordered w-full text-sm"
								>
									<option value="">Tidak Diketahui / Lewati</option>
									<option value="baik">Baik (Air cepat meresap)</option>
									<option value="sedang">Sedang (Air meresap cukup lama)</option>
									<option value="buruk">Buruk (Air menggenang lama)</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		{#if step === 2}
			<!-- STEP 2: KONDISI PEMILIK -->
			<div class="space-y-4">
				<h2
					class="text-lg font-bold border-b border-base-200 pb-2 text-base-content flex items-center gap-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-primary"
						><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle
							cx="12"
							cy="7"
							r="4"
						/></svg
					>
					<span>Langkah 2: Profil & Kondisi Pemilik</span>
				</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Pengalaman Bertani -->
					<div class="form-control w-full">
						<label class="label font-semibold" for="select-pengalaman">
							<span class="label-text">Pengalaman Bertani</span>
						</label>
						<select
							id="select-pengalaman"
							bind:value={pengalaman}
							class="select select-bordered w-full"
						>
							<option value="" disabled>Pilih tingkat pengalaman</option>
							<option value="pemula">Pemula (Belum pernah atau jarang menanam)</option>
							<option value="berpengalaman"
								>Berpengalaman (Sering menanam dan paham pemupukan/hama)</option
							>
						</select>
					</div>

					<!-- Ketersediaan Waktu Perawatan -->
					<div class="form-control w-full">
						<label class="label font-semibold" for="select-waktu">
							<span class="label-text">Ketersediaan Waktu Harian</span>
						</label>
						<select id="select-waktu" bind:value={waktu} class="select select-bordered w-full">
							<option value="" disabled>Pilih ketersediaan waktu</option>
							<option value="sibuk">Sibuk (&lt;30 menit sehari untuk berkebun)</option>
							<option value="cukup">Cukup (&gt;30 menit sehari untuk menyiram & merawat)</option>
						</select>
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Jumlah Anggota Keluarga -->
					<div class="form-control w-full">
						<label class="label font-semibold" for="input-anggota">
							<span class="label-text">Jumlah Anggota Keluarga</span>
						</label>
						<input
							type="number"
							id="input-anggota"
							bind:value={jumlah_anggota}
							min="1"
							class="input input-bordered w-full"
						/>
					</div>

					<!-- Kehadiran Anak Kecil -->
					<div class="form-control w-full justify-center">
						<label
							class="label cursor-pointer justify-start gap-4 p-4 border border-base-300 rounded-lg bg-base-200/40"
						>
							<input type="checkbox" bind:checked={ada_anak} class="checkbox checkbox-primary" />
							<div>
								<span class="label-text font-semibold block">Ada Anak Kecil di Rumah</span>
								<span class="label-text-alt opacity-60"
									>Rekomendasikan tanaman yang aman (tidak tajam/berduri)</span
								>
							</div>
						</label>
					</div>
				</div>
			</div>
		{/if}

		{#if step === 3}
			<!-- STEP 3: KONDISI KEUANGAN -->
			<div class="space-y-4">
				<h2
					class="text-lg font-bold border-b border-base-200 pb-2 text-base-content flex items-center gap-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-primary"
						><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path
							d="M18 12a2 2 0 0 0 0 4h4v-4Z"
						/></svg
					>
					<span>Langkah 3: Alokasi Budget & Finansial</span>
				</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Estimasi Budget Awal -->
					<div class="form-control w-full">
						<label class="label font-semibold" for="select-budget">
							<span class="label-text">Budget Awal Penanaman</span>
						</label>
						<select id="select-budget" bind:value={budget} class="select select-bordered w-full">
							<option value="" disabled>Pilih alokasi budget</option>
							<option value="rendah">Rendah (&lt; Rp200.000)</option>
							<option value="sedang">Sedang (Rp200.000 - Rp500.000)</option>
							<option value="tinggi">Tinggi (&gt; Rp500.000)</option>
						</select>
					</div>

					<!-- Prioritas Finansial -->
					<div class="form-control w-full">
						<label class="label font-semibold" for="select-tujuan-finansial">
							<span class="label-text">Prioritas Hasil Finansial</span>
						</label>
						<select
							id="select-tujuan-finansial"
							bind:value={tujuan_finansial}
							class="select select-bordered w-full"
						>
							<option value="" disabled>Pilih prioritas finansial</option>
							<option value="hemat">Menghemat Pengeluaran Dapur Harian</option>
							<option value="jual">Menghasilkan Pendapatan Tambahan (Dijual Kembali)</option>
						</select>
					</div>
				</div>
			</div>
		{/if}

		{#if step === 4}
			<!-- STEP 4: TUJUAN PENANAMAN -->
			<div class="space-y-4">
				<h2
					class="text-lg font-bold border-b border-base-200 pb-2 text-base-content flex items-center gap-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-primary"
						><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle
							cx="12"
							cy="12"
							r="2"
						/></svg
					>
					<span>Langkah 4: Tujuan Penanaman Utama</span>
				</h2>

				<!-- Pilihan Tujuan -->
				<div class="form-control w-full">
					<label class="label font-semibold" for="select-tujuan">
						<span class="label-text">Apa Tujuan Utama Anda Menanam?</span>
					</label>
					<select id="select-tujuan" bind:value={tujuan} class="select select-bordered w-full">
						<option value="" disabled>Pilih salah satu tujuan</option>
						<option value="konsumsi">Konsumsi Rumah Tangga Sendiri</option>
						<option value="pangan">Kemendirian Ketahanan Pangan Keluarga</option>
						<option value="estetika">Keindahan Pekarangan / Hiasan</option>
						<option value="edukasi">Edukasi Pembelajaran Keluarga / Anak</option>
						<option value="bisnis">Komersial Skala Kecil / Bisnis Sampingan</option>
					</select>
				</div>
			</div>
		{/if}

		<!-- Action Buttons -->
		<div class="flex justify-between items-center border-t border-base-200 pt-4 mt-6">
			{#if step > 1}
				<button type="button" onclick={prevStep} class="btn btn-outline" disabled={loading}>
					Sebelumnya
				</button>
			{:else}
				<div></div>
			{/if}

			{#if step < 4}
				<button type="button" onclick={nextStep} class="btn btn-primary"> Selanjutnya </button>
			{:else}
				<button type="submit" class="btn btn-primary px-8" disabled={loading}>
					{#if loading}
						<span class="loading loading-spinner loading-sm"></span> Memproses...
					{:else}
						Dapatkan Hasil
					{/if}
				</button>
			{/if}
		</div>
	</form>
</div>
