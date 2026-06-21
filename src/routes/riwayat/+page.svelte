<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

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

	function getTopPlant(hasil: { label: string }[] | null | undefined) {
		if (!hasil || !hasil.length) return '-';
		return hasil[0].label; // ranking 1
	}

	function getScore(hasil: { score: number }[] | null | undefined) {
		if (!hasil || !hasil.length) return '-';
		return hasil[0].score + ' poin';
	}
</script>

<svelte:head>
	<title>Riwayat Konsultasi - TaniPakar</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6">
	<!-- Header -->
	<div class="card bg-base-100 shadow-sm border border-base-300 p-8">
		<h1 class="text-2xl font-bold text-base-content">Riwayat Konsultasi</h1>
		<p class="text-sm mt-2 text-base-content/70">
			Daftar riwayat penggunaan sistem pakar beserta hasil rekomendasi tanaman terbaiknya.
		</p>
	</div>

	<!-- Table -->
	<div class="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
		{#if data.riwayatList && data.riwayatList.length > 0}
			<div class="overflow-x-auto">
				<table class="table table-zebra w-full text-sm">
					<thead class="bg-base-200/50 text-base-content">
						<tr>
							<th class="w-16 text-center">No</th>
							<th class="w-48">Waktu</th>
							<th>Tujuan & Lahan</th>
							<th>Rekomendasi Utama</th>
							<th class="text-center">Aturan Aktif</th>
						</tr>
					</thead>
					<tbody>
						{#each data.riwayatList as item, idx (item.id)}
							<tr class="hover">
								<td class="text-center font-semibold opacity-60">{idx + 1}</td>
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
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
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
				<h3 class="text-lg font-bold">Belum Ada Riwayat</h3>
				<p class="text-sm opacity-60">
					Riwayat konsultasi pengguna akan muncul di sini setelah form diisi.
				</p>
				<a href="/konsultasi" class="btn btn-primary btn-sm mt-2">Mulai Konsultasi Baru</a>
			</div>
		{/if}
	</div>
</div>
