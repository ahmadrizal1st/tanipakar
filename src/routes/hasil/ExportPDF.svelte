<script lang="ts">
	function exportToPDF() {
		// Menggunakan fitur print bawaan browser
		// Jauh lebih baik karena menghasilkan teks vektor yang bisa diseleksi,
		// serta pemotongan halaman (page breaks) otomatis yang rapi.
		window.print();
	}
</script>

<button
	onclick={exportToPDF}
	class="btn btn-outline border-base-300 hover:bg-base-200 hover:text-base-content hover:border-base-400 w-full sm:w-auto shadow-sm no-print"
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
		><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
			points="7 10 12 15 17 10"
		/><line x1="12" x2="12" y1="15" y2="3" /></svg
	>
	Cetak / Simpan PDF
</button>
