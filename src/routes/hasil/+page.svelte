<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { HasilInference } from '$lib/inference';
	import type { Fakta } from '$lib/rules';
	import SkorChart from './SkorChart.svelte';
	import { plantsData } from '$lib/plants';
	import ExportPDF from './ExportPDF.svelte';

	let fakta = $state<Fakta | null>(null);
	let rankedResults = $state<HasilInference['ranked']>([]);
	let hasLoaded = $state(false);

	onMount(() => {
		try {
			const factsRaw = sessionStorage.getItem('tanipakar_fakta');
			const resultsRaw = sessionStorage.getItem('tanipakar_hasil');

			if (!factsRaw || !resultsRaw) {
				goto('/');
				return;
			}

			fakta = JSON.parse(factsRaw);
			rankedResults = JSON.parse(resultsRaw);
		} catch (err: unknown) {
			const error = err as Error;
			console.error('Gagal memuat hasil dari sessionStorage:', error.message);
			goto('/');
		} finally {
			hasLoaded = true;
		}
	});

	function resetConsultation() {
		sessionStorage.removeItem('tanipakar_fakta');
		sessionStorage.removeItem('tanipakar_hasil');
		goto('/');
	}

	// Color level badge helper
	function getBadgeClass(level: string) {
		switch (level) {
			case 'Sangat Direkomendasikan':
				return 'badge-success text-white';
			case 'Direkomendasikan':
				return 'badge-info text-white';
			default:
				return 'badge-warning text-white';
		}
	}
</script>

<div class="space-y-6" id="pdf-content">
	{#if !hasLoaded}
		<div class="flex flex-col items-center justify-center py-16 space-y-4">
			<span class="loading loading-spinner loading-lg text-primary"></span>
			<p class="text-sm text-base-content/60">Memuat analisis...</p>
		</div>
	{:else}
		<!-- Header - Minimal & Professional -->
		<div class="card bg-base-100 shadow-sm border border-base-300 p-8 text-center">
			<h1 class="text-2xl font-bold text-base-content">Rekomendasi Tanaman Pekarangan</h1>
			<p class="text-sm mt-2 text-base-content/60 max-w-lg mx-auto">
				Berikut adalah hasil analisis kesesuaian tanaman pekarangan berdasarkan parameter kondisi
				lingkungan, pemilik, keuangan, dan tujuan Anda.
			</p>
		</div>

		<!-- Ringkasan Input -->
		{#if fakta}
			<div class="collapse collapse-arrow bg-base-100 shadow-sm border border-base-300 rounded-xl">
				<input type="checkbox" id="toggle-input-summary" />
				<label
					class="collapse-title text-sm font-semibold flex items-center gap-2 cursor-pointer"
					for="toggle-input-summary"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-primary"
						><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 8h10" /><path
							d="M7 12h10"
						/><path d="M7 16h10" /></svg
					>
					<span>Parameter Kondisi Anda</span>
				</label>
				<div class="collapse-content">
					<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-3 border-t border-base-200">
						<div>
							<span class="block opacity-65 font-medium">Luas Lahan:</span>
							<span class="font-semibold text-base-content">{fakta.luas} m²</span>
						</div>
						<div>
							<span class="block opacity-65 font-medium">Sinar Matahari:</span>
							<span class="font-semibold text-base-content capitalize">{fakta.matahari}</span>
						</div>
						<div>
							<span class="block opacity-65 font-medium">Ketersediaan Air:</span>
							<span class="font-semibold text-base-content capitalize">{fakta.air}</span>
						</div>
						<div>
							<span class="block opacity-65 font-medium">Media Tanam:</span>
							<span class="font-semibold text-base-content capitalize"
								>{fakta.tanah === 'subur' ? 'Tanah Langsung' : 'Pot/Polybag'}</span
							>
						</div>
						<div>
							<span class="block opacity-65 font-medium">Pengalaman Bertani:</span>
							<span class="font-semibold text-base-content capitalize">{fakta.pengalaman}</span>
						</div>
						<div>
							<span class="block opacity-65 font-medium">Waktu Perawatan:</span>
							<span class="font-semibold text-base-content capitalize"
								>{fakta.waktu === 'sibuk' ? 'Terbatas (<30 menit)' : 'Cukup (>30 menit)'}</span
							>
						</div>
						<div>
							<span class="block opacity-65 font-medium">Jumlah Keluarga:</span>
							<span class="font-semibold text-base-content"
								>{fakta.jumlah_anggota} Orang {fakta.ada_anak ? '(Ada Anak Kecil)' : ''}</span
							>
						</div>
						<div>
							<span class="block opacity-65 font-medium">Alokasi Budget:</span>
							<span class="font-semibold text-base-content capitalize">{fakta.budget}</span>
						</div>
						<div>
							<span class="block opacity-65 font-medium">Tujuan Finansial:</span>
							<span class="font-semibold text-base-content capitalize"
								>{fakta.tujuan_finansial === 'hemat' ? 'Menghemat Belanja' : 'Dijual Kembali'}</span
							>
						</div>
						<div>
							<span class="block opacity-65 font-medium">Tujuan Utama:</span>
							<span class="font-semibold text-base-content capitalize">{fakta.tujuan}</span>
						</div>
						{#if fakta.ph !== null}
							<div>
								<span class="block opacity-65 font-medium">pH Tanah:</span>
								<span class="font-semibold text-base-content">{fakta.ph}</span>
							</div>
						{/if}
						{#if fakta.suhu_tanah !== null}
							<div>
								<span class="block opacity-65 font-medium">Suhu Tanah:</span>
								<span class="font-semibold text-base-content">{fakta.suhu_tanah} °C</span>
							</div>
						{/if}
						{#if fakta.tekstur !== null}
							<div>
								<span class="block opacity-65 font-medium">Tekstur Tanah:</span>
								<span class="font-semibold text-base-content capitalize"
									>{fakta.tekstur.replace('_', ' ')}</span
								>
							</div>
						{/if}
						{#if fakta.drainase !== null}
							<div>
								<span class="block opacity-65 font-medium">Drainase Tanah:</span>
								<span class="font-semibold text-base-content capitalize">{fakta.drainase}</span>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		{#if rankedResults.length > 0}
			<SkorChart results={rankedResults} />
		{/if}

		<!-- Main Results List -->
		{#if rankedResults.length === 0}
			<div class="card bg-base-100 shadow-sm border border-base-300 p-8 text-center space-y-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="text-warning mx-auto"
					><path
						d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
					/><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg
				>
				<h2 class="text-lg font-bold">Tidak Ada Tanaman yang Cocok</h2>
				<p class="text-sm text-base-content/60 max-w-md mx-auto">
					Kombinasi jawaban Anda membuat sistem tidak menemukan tanaman yang memenuhi skor kecocokan
					minimum. Coba sesuaikan luas lahan, paparan matahari, atau ketersediaan air Anda.
				</p>
				<div class="no-print">
					<button onclick={resetConsultation} class="btn btn-primary px-8 mt-2">
						Konsultasi Ulang
					</button>
				</div>
			</div>
		{:else}
			<div class="space-y-4">
				{#each rankedResults as item, index (item.plant)}
					<div
						class="card md:card-side bg-base-100 shadow-sm border border-base-300 overflow-hidden hover:border-base-content/30 transition-all duration-200"
					>
						<!-- Visual Area - Professional minimal layout -->
						<div
							class="md:w-1/4 bg-base-200/40 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-base-300 min-h-[140px] md:min-h-0"
						>
							<div
								class="w-16 height-16 bg-primary/10 rounded-full flex items-center justify-center mb-3"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="28"
									height="28"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-primary"
									><path d="M7 20h10" /><path
										d="M10 20c5.5-2.5 8-6.4 8-12a4 4 0 0 0-8 0c0 5.6 2.5 9.5 8 12Z"
									/><path d="M14 20c-5.5-2.5-8-6.4-8-12a4 4 0 0 1 8 0c0 5.6-2.5 9.5-8 12Z" /></svg
								>
							</div>
							<div class="text-center space-y-1.5">
								<span class="badge badge-md {getBadgeClass(item.level)} font-semibold shadow-xs">
									{item.level}
								</span>
								<div class="text-xs font-semibold opacity-70">Skor: {item.score} poin</div>
							</div>
						</div>

						<!-- Recommendation details & active rules -->
						<div class="card-body p-6 md:w-3/4 justify-between">
							<div>
								<div class="flex items-center justify-between mb-2">
									<h2 class="card-title text-xl font-bold text-base-content">
										{index + 1}. {item.label}
									</h2>
								</div>

								<div class="space-y-2 mt-2">
									<h3 class="text-xs uppercase font-extrabold tracking-wider opacity-50">
										Faktor Kesesuaian (Aturan Aktif)
									</h3>
									<ul class="space-y-2">
										{#each item.contributors as contributor (contributor.id)}
											<li
												class="text-sm flex items-start gap-3 bg-base-200/30 p-2.5 rounded-lg border border-base-300/40"
											>
												<span
													class="badge badge-neutral badge-sm font-mono mt-0.5 text-xs select-none"
												>
													{contributor.id}
												</span>
												<span class="text-base-content/80 text-xs md:text-sm"
													>{contributor.alasan}</span
												>
											</li>
										{/each}
									</ul>
								</div>

								<!-- Detail Tanaman -->
								{#if plantsData[item.plant]}
									{@const pData = plantsData[item.plant]}
									<div class="mt-4 pt-4 border-t border-base-200 space-y-3">
										<p class="text-sm text-base-content/80 leading-relaxed">{pData.description}</p>

										<div class="flex flex-wrap gap-2 text-xs">
											<span class="badge badge-outline gap-1 p-3 shadow-sm bg-base-100">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="text-primary"
													><circle cx="12" cy="12" r="10" /><polyline
														points="12 6 12 12 16 14"
													/></svg
												>
												Panen: {pData.harvestTime}
											</span>
											<span class="badge badge-outline gap-1 p-3 shadow-sm bg-base-100">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="text-secondary"
													><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg
												>
												Kesulitan: {pData.difficulty}
											</span>
										</div>

										<div class="bg-primary/5 rounded-lg p-3.5 border border-primary/10 mt-2">
											<span
												class="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wide mb-2"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5" /></svg
												>
												Tips Perawatan
											</span>
											<ul class="list-disc pl-5 space-y-1 text-xs text-base-content/80">
												{#each pData.tips as tip (tip)}
													<li>{tip}</li>
												{/each}
											</ul>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Footer Buttons -->
			<div class="flex justify-center items-center py-4 gap-3 no-print flex-col sm:flex-row">
				<button onclick={resetConsultation} class="btn btn-primary px-8 w-full sm:w-auto shadow-sm">
					Konsultasi Ulang
				</button>
				<ExportPDF targetId="pdf-content" />
			</div>
		{/if}
	{/if}
</div>
