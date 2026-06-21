<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';

	let { children } = $props();
	let theme = $state<'light' | 'dark'>('light');

	onMount(() => {
		const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
		if (savedTheme) {
			theme = savedTheme;
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			theme = prefersDark ? 'dark' : 'light';
		}
		document.documentElement.setAttribute('data-theme', theme);
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', theme);
		document.documentElement.setAttribute('data-theme', theme);
	}
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
				<img src="/logo.png" alt="TaniPakar Logo" class="w-6 h-6 object-contain" />
				TaniPakar
			</a>
		</div>
		<div class="flex-none flex items-center gap-1">
			<a
				href="/"
				class="btn btn-ghost btn-sm font-medium hidden sm:flex text-base-content/80 hover:text-primary"
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
					class="mr-1"
					><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline
						points="9 22 9 12 15 12 15 22"
					/></svg
				>
				Beranda
			</a>
			<a
				href="/konsultasi"
				class="btn btn-ghost btn-sm font-medium hidden sm:flex text-base-content/80 hover:text-primary"
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
					class="mr-1"
					><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path
						d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
					/><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path
						d="M8 16h.01"
					/></svg
				>
				Konsultasi
			</a>
			<a
				href="/riwayat"
				class="btn btn-ghost btn-sm font-medium hidden sm:flex text-base-content/80 hover:text-primary"
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
					class="mr-1"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg
				>
				Riwayat
			</a>
			<a
				href="/knowledge-base"
				class="btn btn-ghost btn-sm font-medium hidden sm:flex text-base-content/80 hover:text-primary"
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
					class="mr-1"
					><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg
				>
				Basis Pengetahuan
			</a>
			<button onclick={toggleTheme} class="btn btn-ghost btn-circle" aria-label="Toggle Theme">
				{#if theme === 'dark'}
					<!-- Sun icon -->
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
						class="lucide lucide-sun"
					>
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2" />
						<path d="M12 20v2" />
						<path d="m4.93 4.93 1.41 1.41" />
						<path d="m17.66 17.66 1.41 1.41" />
						<path d="M2 12h2" />
						<path d="M20 12h2" />
						<path d="m6.34 17.66-1.41 1.41" />
						<path d="m19.07 4.93-1.41 1.41" />
					</svg>
				{:else}
					<!-- Moon icon -->
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
						class="lucide lucide-moon"
					>
						<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
					</svg>
				{/if}
			</button>
		</div>
	</header>

	<!-- Main Content Container -->
	<main class="flex-1 container mx-auto px-4 py-8 max-w-4xl">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="footer footer-center p-4 bg-base-100 text-base-content border-t border-t-base-300">
		<aside>
			<p class="text-sm opacity-70">
				© 2026 TaniPakar - Sistem Pakar Rekomendasi Tanaman Pekarangan
			</p>
		</aside>
	</footer>
</div>
