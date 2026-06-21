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
		<div class="flex-none">
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
