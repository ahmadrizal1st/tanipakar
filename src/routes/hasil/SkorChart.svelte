<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { PLANT_LABELS } from '$lib/rules';

	let { results } = $props<{
		results: {
			plant: string;
			score: number;
			level: string;
			contributors: { id: string; alasan: string }[];
		}[];
	}>();

	let chartCanvas: HTMLCanvasElement;
	let chartInstance: Chart | null = null;

	onMount(() => {
		if (!chartCanvas) return;

		const labels = results.map(
			(r) => PLANT_LABELS[r.plant as keyof typeof PLANT_LABELS] || r.plant
		);
		const data = results.map((r) => r.score);

		// Color logic based on level
		const backgroundColors = results.map((r) => {
			if (r.level === 'Sangat Direkomendasikan') return 'rgba(34, 197, 94, 0.6)'; // success
			if (r.level === 'Direkomendasikan') return 'rgba(56, 189, 248, 0.6)'; // info
			return 'rgba(250, 204, 21, 0.6)'; // warning
		});

		const borderColors = results.map((r) => {
			if (r.level === 'Sangat Direkomendasikan') return 'rgb(34, 197, 94)';
			if (r.level === 'Direkomendasikan') return 'rgb(56, 189, 248)';
			return 'rgb(250, 204, 21)';
		});

		// Theme detection for text color
		const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
		const textColor = isDark ? '#a6adbb' : '#1f2937';
		const gridColor = isDark ? '#1f2937' : '#e5e7eb';

		chartInstance = new Chart(chartCanvas, {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						label: 'Total Poin',
						data,
						backgroundColor: backgroundColors,
						borderColor: borderColors,
						borderWidth: 1,
						borderRadius: 6
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1,
							color: textColor
						},
						grid: {
							color: gridColor
						}
					},
					x: {
						ticks: {
							color: textColor
						},
						grid: {
							display: false
						}
					}
				},
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						backgroundColor: isDark ? '#374151' : '#ffffff',
						titleColor: isDark ? '#f3f4f6' : '#111827',
						bodyColor: isDark ? '#d1d5db' : '#374151',
						borderColor: gridColor,
						borderWidth: 1,
						padding: 10,
						displayColors: false
					}
				}
			}
		});

		return () => {
			if (chartInstance) {
				chartInstance.destroy();
			}
		};
	});
</script>

<div
	class="w-full h-64 md:h-80 bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm relative"
>
	<h3 class="absolute top-4 left-6 text-sm font-bold text-base-content/70">Perbandingan Poin</h3>
	<div class="mt-8 h-[calc(100%-2rem)]">
		<canvas bind:this={chartCanvas}></canvas>
	</div>
</div>
