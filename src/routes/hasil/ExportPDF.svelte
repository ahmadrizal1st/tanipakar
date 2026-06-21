<script lang="ts">
	import { jsPDF } from 'jspdf';
	import html2canvas from 'html2canvas';

	let { targetId = 'pdf-content' } = $props<{ targetId?: string }>();
	let isExporting = $state(false);

	async function exportToPDF() {
		const element = document.getElementById(targetId);
		if (!element) {
			alert('Elemen target tidak ditemukan.');
			return;
		}

		try {
			isExporting = true;

			// Deteksi warna latar agar PDF menyesuaikan dengan tema saat ini (Light/Dark)
			const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
			const bgColor = isDark ? '#1d232a' : '#ffffff';

			// Sembunyikan elemen-elemen yang tidak perlu dicetak (seperti tombol-tombol action)
			const hideElements = document.querySelectorAll('.no-print');
			hideElements.forEach((el) => {
				(el as HTMLElement).style.display = 'none';
			});

			const canvas = await html2canvas(element, {
				scale: 2, // Kualitas 2x lipat
				useCORS: true, // Izinkan cross-origin image (jika ada gambar eksternal)
				backgroundColor: bgColor,
				windowWidth: element.scrollWidth,
				windowHeight: element.scrollHeight
			});

			// Kembalikan visibilitas elemen
			hideElements.forEach((el) => {
				(el as HTMLElement).style.display = '';
			});

			const imgData = canvas.toDataURL('image/png');

			// Buat PDF ukuran A4 (Portrait)
			const pdf = new jsPDF({
				orientation: 'portrait',
				unit: 'mm',
				format: 'a4'
			});

			const pdfWidth = pdf.internal.pageSize.getWidth();
			// Hitung proporsi tinggi menyesuaikan lebar A4
			const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

			pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
			pdf.save('Hasil_Konsultasi_TaniPakar.pdf');
		} catch (error) {
			console.error('Error generating PDF:', error);
			alert('Gagal menghasilkan file PDF. Silakan coba lagi.');
		} finally {
			isExporting = false;
		}
	}
</script>

<button
	onclick={exportToPDF}
	class="btn btn-outline border-base-300 hover:bg-base-200 hover:text-base-content hover:border-base-400 w-full sm:w-auto shadow-sm"
	disabled={isExporting}
>
	{#if isExporting}
		<span class="loading loading-spinner loading-sm"></span> Menyiapkan PDF...
	{:else}
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
		Unduh Laporan PDF
	{/if}
</button>
