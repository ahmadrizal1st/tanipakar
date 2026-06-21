<script lang="ts">
	import { rules, PLANT_LABELS } from '$lib/rules';

	let activeCategory = $state<string>('semua');

	const categories = [
		{ id: 'semua', label: 'Semua' },
		{ id: 'lingkungan', label: 'Lingkungan' },
		{ id: 'kualitas_tanah', label: 'Kualitas Tanah' },
		{ id: 'pemilik', label: 'Profil Pemilik' },
		{ id: 'keuangan', label: 'Keuangan' },
		{ id: 'tujuan', label: 'Tujuan' }
	];

	let filteredRules = $derived(
		activeCategory === 'semua' ? rules : rules.filter((r) => r.category === activeCategory)
	);

	function formatScore(scoreObj: Record<string, number>) {
		return Object.entries(scoreObj)
			.map(([key, val]) => {
				const plantName = PLANT_LABELS[key as keyof typeof PLANT_LABELS] || key;
				return `<span class="badge badge-sm badge-primary badge-outline whitespace-nowrap mb-1 mr-1 shadow-sm font-semibold">${plantName}: +${val}</span>`;
			})
			.join('');
	}
</script>

<svelte:head>
	<title>Basis Pengetahuan - TaniPakar</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-6">
	<!-- Header Section -->
	<div
		class="card bg-base-100 shadow-sm border border-base-300 p-8 text-center relative overflow-hidden"
	>
		<!-- Decorative background blob -->
		<div
			class="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"
		></div>

		<h1 class="text-3xl font-bold text-base-content relative z-10">
			Basis Pengetahuan (Knowledge Base)
		</h1>
		<p class="text-sm mt-3 text-base-content/70 max-w-2xl mx-auto relative z-10">
			Sistem pakar ini menggunakan metode <strong class="text-primary">Forward Chaining</strong>
			dengan total
			<strong class="text-primary">{rules.length} aturan (rules)</strong> independen. Berikut adalah tabel
			transparansi seluruh aturan inferensi yang mengevaluasi parameter pengguna menjadi poin kesesuaian
			tanaman.
		</p>
	</div>

	<!-- Tabs/Filter -->
	<div
		class="tabs tabs-boxed bg-base-200/50 justify-center flex-wrap p-1 shadow-inner max-w-2xl mx-auto"
	>
		{#each categories as cat (cat.id)}
			<button
				class="tab {activeCategory === cat.id
					? 'tab-active font-bold shadow-sm'
					: 'text-base-content/70'}"
				onclick={() => (activeCategory = cat.id)}
			>
				{cat.label}
			</button>
		{/each}
	</div>

	<!-- Table -->
	<div class="overflow-x-auto bg-base-100 border border-base-300 rounded-xl shadow-sm">
		<table class="table table-zebra w-full text-sm">
			<thead class="bg-base-200/50 text-base-content font-bold uppercase tracking-wider text-xs">
				<tr>
					<th class="w-16 text-center">ID</th>
					<th class="w-36">Kategori Parameter</th>
					<th>Kondisi & Penjelasan Ilmiah</th>
					<th class="w-56">Kesimpulan (Poin)</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredRules as rule (rule.id)}
					<tr class="hover">
						<td class="font-mono text-xs font-bold text-center text-base-content/60">{rule.id}</td>
						<td>
							<span
								class="badge badge-ghost text-[10px] uppercase font-bold tracking-wider opacity-80"
							>
								{rule.category.replace('_', ' ')}
							</span>
						</td>
						<td class="text-base-content/80 leading-relaxed max-w-md">{rule.alasan}</td>
						<td class="flex flex-wrap gap-1 leading-none py-3 content-center">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html formatScore(rule.score)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		{#if filteredRules.length === 0}
			<div class="p-8 text-center text-base-content/50">Tidak ada aturan dalam kategori ini.</div>
		{/if}
	</div>
</div>
