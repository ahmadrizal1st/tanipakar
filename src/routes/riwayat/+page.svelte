<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let filterMode = $state<'semua' | 'saya'>('semua');
	let mySessionId = $state<string | null>(null);
	let currentPage = $state(1);
	const itemsPerPage = 10;

	onMount(() => {
		mySessionId = localStorage.getItem('tanipakar_session_id');
	});

	function formatDate(dateStr: string | Date | null) {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getTopPlant(hasilRaw: unknown) {
		if (!hasilRaw) return '-';
		const hasil = hasilRaw as Record<string, unknown>;
		const ranked = Array.isArray(hasil) ? hasil : Array.isArray(hasil?.ranked) ? hasil.ranked : [];
		if (!ranked || !ranked.length) return '-';
		return ranked[0].label; // ranking 1
	}

	function getScore(hasilRaw: unknown) {
		if (!hasilRaw) return '-';
		const hasil = hasilRaw as Record<string, unknown>;
		const ranked = Array.isArray(hasil) ? hasil : Array.isArray(hasil?.ranked) ? hasil.ranked : [];
		if (!ranked || !ranked.length) return '-';
		return ranked[0].score + ' poin';
	}
</script>

<svelte:head>
	<title>Riwayat Konsultasi - TaniPakar</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6">
	<!-- Header -->
	<div
		class="card bg-base-100 shadow-sm border border-base-300 p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
	>
		<div>
			<h1 class="text-2xl font-bold text-base-content">Riwayat Konsultasi</h1>
			<p class="text-sm mt-2 text-base-content/70">
				Daftar riwayat penggunaan sistem pakar beserta hasil rekomendasi tanaman terbaiknya.
			</p>
		</div>

		<div class="join bg-base-200/50 p-1 rounded-lg">
			<button
				class="join-item btn btn-sm {filterMode === 'semua'
					? 'btn-active btn-primary'
					: 'btn-ghost'}"
				onclick={() => {
					filterMode = 'semua';
					currentPage = 1;
				}}>Semua Riwayat</button
			>
			<button
				class="join-item btn btn-sm {filterMode === 'saya'
					? 'btn-active btn-primary'
					: 'btn-ghost'}"
				onclick={() => {
					filterMode = 'saya';
					currentPage = 1;
				}}>Riwayat Saya</button
			>
		</div>
	</div>

	<!-- Table -->
	<div class="card bg-base-100 shadow-sm border border-base-300 overflow-hidden min-h-[300px]">
		{#await data.streamed.riwayatList}
			<div class="flex flex-col items-center justify-center p-16 space-y-4">
				<span class="loading loading-spinner loading-lg text-primary"></span>
				<p class="text-sm text-base-content/60">Mengambil data dari server...</p>
			</div>
		{:then riwayatList}
			{@const filteredRiwayat =
				filterMode === 'saya' && mySessionId
					? riwayatList.filter((i) => i.session_id === mySessionId)
					: riwayatList}
			{@const totalPages = Math.ceil(filteredRiwayat.length / itemsPerPage)}
			{@const paginatedRiwayat = filteredRiwayat.slice(
				(currentPage - 1) * itemsPerPage,
				currentPage * itemsPerPage
			)}

			{#if filteredRiwayat && filteredRiwayat.length > 0}
				<div class="overflow-x-auto">
					<table class="table table-zebra w-full text-sm">
						<thead class="bg-base-200/50 text-base-content">
							<tr>
								<th class="w-16 text-center">No</th>
								<th class="w-48">Waktu</th>
								<th>Tujuan & Lahan</th>
								<th>Rekomendasi Utama</th>
								<th class="text-center">Aturan Aktif</th>
								<th class="text-center">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{#each paginatedRiwayat as item, idx (item.id)}
								{@const isMine = item.session_id === mySessionId && filterMode === 'semua'}
								<tr class="hover {isMine ? 'bg-info/10 border-l-4 border-l-info' : ''}">
									<td class="text-center font-semibold opacity-60">
										{(currentPage - 1) * itemsPerPage + idx + 1}
									</td>
									<td class="opacity-80 text-xs">{formatDate(item.created_at)}</td>
									<td>
										<div class="flex flex-col gap-1">
											<span class="badge badge-ghost badge-sm capitalize"
												>{item.fakta?.tujuan || '-'}</span
											>
											<span class="text-xs opacity-70"
												>{item.fakta?.luas || 0} m² • {item.fakta?.tanah || '-'}</span
											>
										</div>
									</td>
									<td>
										<div class="flex flex-col gap-1 items-start">
											<span class="font-bold text-primary">{getTopPlant(item.hasil)}</span>
											<span class="text-xs opacity-70">Skor: {getScore(item.hasil)}</span>
										</div>
									</td>
									<td class="text-center">
										<span class="badge badge-neutral badge-sm">{item.rules_aktif || 0}</span>
									</td>
									<td class="text-center">
										<a href="/riwayat/{item.id}" class="btn btn-xs btn-outline btn-primary">
											Detail
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Pagination Controls -->
				{#if totalPages > 1}
					<div class="flex justify-center p-4 border-t border-base-200">
						<div class="join">
							<button
								class="join-item btn btn-sm"
								disabled={currentPage === 1}
								onclick={() => (currentPage -= 1)}>«</button
							>
							<button class="join-item btn btn-sm">Halaman {currentPage} dari {totalPages}</button>
							<button
								class="join-item btn btn-sm"
								disabled={currentPage === totalPages}
								onclick={() => (currentPage += 1)}>»</button
							>
						</div>
					</div>
				{/if}
			{:else}
				<div class="p-12 text-center space-y-3">
					<div class="opacity-20 flex justify-center mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /><path
								d="M14 3v5h5"
							/><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg
						>
					</div>
					<h3 class="text-lg font-bold">
						{filterMode === 'saya' ? 'Anda Belum Melakukan Konsultasi' : 'Belum Ada Riwayat'}
					</h3>
					<p class="text-sm opacity-60">
						{filterMode === 'saya'
							? 'Lakukan pengisian form untuk menyimpan riwayat Anda di perangkat ini.'
							: 'Riwayat konsultasi pengguna akan muncul di sini setelah form diisi.'}
					</p>
					<a href="/konsultasi" class="btn btn-primary btn-sm mt-2">Mulai Konsultasi Baru</a>
				</div>
			{/if}
		{/await}
	</div>
</div>
