<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>TaniPakar - Rekomendasi Tanaman Pekarangan</title>
</svelte:head>

<div class="min-h-screen bg-base-200 text-base-content flex flex-col font-sans">
	<!-- Navbar -->
	<header
		class="navbar bg-base-100 shadow-sm border-b border-base-300 px-4 md:px-8 sticky top-0 z-50"
	>
		<div class="flex-1">
			<a
				href="/"
				class="text-xl font-semibold tracking-tight text-primary flex items-center gap-2 hover:opacity-80 transition-opacity"
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
					class="lucide lucide-sprout"
					><path d="M7 20h10" /><path
						d="M10 20c5.5-2.5 8-6.4 8-12a4 4 0 0 0-8 0c0 5.6 2.5 9.5 8 12Z"
					/><path d="M14 20c-5.5-2.5-8-6.4-8-12a4 4 0 0 1 8 0c0 5.6-2.5 9.5-8 12Z" /></svg
				>
				TaniPakar
			</a>
		</div>
	</header>

	<!-- Main Content Container -->
	<main class="flex-1 container mx-auto px-4 py-8 max-w-4xl">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="footer footer-center p-4 bg-base-100 text-base-content border-t border-base-300">
		<aside>
			<p class="text-sm opacity-70">
				© 2026 TaniPakar - Sistem Pakar Rekomendasi Tanaman Pekarangan
			</p>
		</aside>
	</footer>
</div>
