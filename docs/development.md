# Tahapan Pembuatan

## Fase 1 — Setup & Foundation

**Goal:** Project berjalan di lokal dengan struktur lengkap.

- [ ] Inisialisasi project SvelteKit dengan Bun
- [ ] Setup Tailwind CSS v4 & daisyUI
- [ ] Buat `.env` dan koneksi Neon PostgreSQL
- [ ] Setup Drizzle ORM + buat schema + push migration
- [ ] Buat `src/lib/rules.ts` — pindahkan semua 39 rules (24 wajib + 15 opsional kualitas tanah)
- [ ] Buat `src/lib/inference.ts` — forward chaining engine
- [ ] Test inference engine di console / unit test sederhana

**Output:** Logic sistem pakar jalan, database terhubung.

---

## Fase 2 — Core Feature

**Goal:** Form konsultasi dan halaman hasil bisa dipakai end-to-end.

- [ ] Buat layout global (`+layout.svelte`) — navbar sederhana
- [ ] Buat form wizard 4 step di `+page.svelte`
  - Step 1: Kondisi Lingkungan
  - Step 2: Kondisi Pemilik
  - Step 3: Kondisi Keuangan
  - Step 4: Tujuan
- [ ] Validasi per step
- [ ] Buat API endpoint `POST /api/konsultasi`
- [ ] Buat halaman hasil `/hasil` — tampilkan ranking + skor + alasan

**Output:** Sistem pakar bisa digunakan dari form sampai hasil.

---

## Fase 3 — Explanation & Visualisasi

**Goal:** Fitur yang membedakan dari tugas biasa.

- [ ] Buat komponen `ExplanationPanel` — daftar rules yang aktif
- [ ] Per tanaman: tampilkan rules kontributor + alasan teks
- [ ] Buat `SkorChart.svelte` — bar chart dengan Chart.js
- [ ] Buat halaman `/knowledge-base` — tabel semua 39 rules
- [ ] Tambah info tanaman (deskripsi, waktu panen, tips) di `plants.ts`

**Output:** Explanation facility lengkap, visualisasi skor, dan knowledge base publik.

---

## Fase 4 — Fitur Tambahan

**Goal:** Polishing dan fitur nilai lebih.

- [ ] Halaman `/history` — ambil data dari DB, tampilkan tabel riwayat
- [ ] Komponen `ExportPDF.svelte` — download hasil sebagai PDF (jsPDF)
- [ ] Tombol "Konsultasi Ulang" — reset state form
- [ ] Responsive design — pastikan mobile-friendly
- [ ] Tambah loading state saat form submit

**Output:** Semua fitur selesai, siap deploy.

---

## Fase 5 — Deploy & Finishing

**Goal:** Aplikasi live dan bisa diakses publik.

- [ ] Push ke GitHub repository
- [ ] Buat project di Vercel, hubungkan dengan GitHub
- [ ] Set environment variables di Vercel dashboard (`DATABASE_URL`)
- [ ] Tambah `vercel.json` dengan `"bunVersion": "1.x"`
- [ ] Test di production URL
- [ ] Buat laporan / dokumentasi tugas jika diperlukan

**Output:** Aplikasi live, URL bisa dikumpulkan ke dosen.

---

## Ringkasan Fase

| Fase | Fokus | Estimasi |
|---|---|---|
| 1 — Setup | Project init, DB, rules, inference engine | 1 hari |
| 2 — Core | Form wizard + API + halaman hasil | 1 hari |
| 3 — Explanation | Penjelasan rules + chart + knowledge base | 1 hari |
| 4 — Tambahan | History, export PDF, responsive | 1 hari |
| 5 — Deploy | Vercel deployment + laporan | 1 hari |
| **Total** | | **5 hari** |
