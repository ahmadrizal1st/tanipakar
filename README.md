# 📋 Sistem Pakar Rekomendasi Tanaman Pekarangan Rumah

> Sistem pakar berbasis web untuk memberikan rekomendasi tanaman yang cocok ditanam di pekarangan rumah. Sistem menggunakan metode **Forward Chaining** — memproses fakta dari input pengguna kemudian mencocokkan dengan rules yang telah didefinisikan oleh pakar, lalu menghasilkan rekomendasi berupa ranking tanaman beserta alasannya.

## 📖 Dokumentasi Lengkap

- [Arsitektur, Struktur Project, & API](docs/architecture.md)
- [Knowledge Base & Inference Engine](docs/expert-system.md)
- [Tahapan Pembuatan](docs/development.md)

---

## 1. Gambaran Umum

### Tujuan

- Membantu masyarakat memilih tanaman yang tepat berdasarkan kondisi lahan dan kebutuhan mereka
- Mengimplementasikan sistem pakar berbasis aturan (rule-based expert system) sebagai tugas kuliah
- Menampilkan transparansi keputusan melalui *explanation facility*

### Output Tanaman

| Tanaman | Gambar |
|---|---|
| Cabai | ![Cabai](/images/cabai.webp) |
| Tomat | ![Tomat](/images/tomat.webp) |
| Terong | ![Terong](/images/terong.webp) |
| Kangkung | ![Kangkung](/images/kangkung.webp) |
| Daun Bawang | ![Daun Bawang](/images/daun-bawang.webp) |

---

## 2. Tech Stack

### Core

| Layer | Teknologi | Versi |
|---|---|---|
| Runtime | Bun | Latest (1.x) |
| Framework | SvelteKit | 2.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Component | daisyUI | Latest |

### Backend & Data

| Layer | Teknologi | Keterangan |
|---|---|---|
| ORM | Drizzle ORM | Type-safe, ringan |
| Database | Neon PostgreSQL | Serverless, gratis tier |
| API | SvelteKit `+server.ts` | Built-in, tidak butuh framework terpisah |

### Frontend

| Kebutuhan | Teknologi | Keterangan |
|---|---|---|
| Visualisasi chart | Chart.js | Bar chart skor tanaman |
| Export PDF | jsPDF | Download hasil konsultasi |
| Icon | Lucide Svelte | Icon library ringan |

### DevOps

| Kebutuhan | Teknologi |
|---|---|
| Deploy | Vercel |
| Version Control | GitHub |
| Package Manager | Bun |

### Mengapa SvelteKit?

- Syntax paling bersih — tidak ada boilerplate seperti `useState`/`useEffect`
- Reaktivitas built-in, cocok untuk form-heavy app seperti sistem pakar
- Bundle size kecil, performa baik out of the box
- Satu file `.svelte` = HTML + logic + CSS (self-contained)
- Nilai lebih di mata dosen karena tidak umum dipakai mahasiswa

### Mengapa Bun?

- Lebih cepat dari Node.js untuk instalasi dan build
- TypeScript support zero-config tanpa setup tambahan
- Vercel sudah support Bun Runtime secara native (Public Beta, Oktober 2025)
- Aktifkan dengan satu baris di `vercel.json`: `"bunVersion": "1.x"`

---

## 3. Fitur Aplikasi

### Fitur Utama (Wajib)

#### 1. Form Konsultasi Wizard
- Input dibagi 4 step sesuai kategori rules: Lingkungan, Pemilik, Keuangan, Tujuan
- Validasi per step sebelum lanjut ke step berikutnya
- Progress indicator di bagian atas

**Input yang dikumpulkan:**

| Field | Tipe | Pilihan |
|---|---|---|
| Luas pekarangan | Number | Input angka (m²) |
| Intensitas matahari | Select | Penuh / Sebagian / Teduh |
| Ketersediaan air | Select | Mudah / Terbatas |
| Kondisi tanah | Select | Subur / Pot/Polybag |
| Waktu perawatan | Select | Sibuk / Cukup |
| Pengalaman berkebun | Select | Pemula / Berpengalaman |
| Ada anak kecil | Toggle | Ya / Tidak |
| Jumlah anggota keluarga | Number | Input angka |
| Budget awal | Select | Rendah / Sedang / Tinggi |
| Tujuan finansial | Select | Hemat belanja / Jual hasil |
| Tujuan utama | Select | Konsumsi / Estetika / Edukasi / Pangan / Bisnis |

**Input tambahan — Kualitas Tanah (opsional):**

Ditampilkan sebagai blok tambahan di Step 1 (Lingkungan), dengan checkbox di depan tiap field. Field yang tidak dicentang akan di-skip — rule terkait tidak dievaluasi dan tidak mempengaruhi skor.

| Field | Tipe | Pilihan |
|---|---|---|
| pH tanah | Number | Input angka (contoh: 6.5) |
| Suhu tanah | Number | Input angka (°C) |
| Tekstur tanah | Select | Lempung berpasir / Lempung / Pasir / Liat |
| Drainase | Select | Baik / Sedang / Buruk |

Mockup tampilan:

```
Kondisi Tanah (Opsional — lewati jika tidak tahu)
[ ] pH Tanah        : [____] (contoh: 6.5)
[ ] Suhu Tanah      : [____] °C
[ ] Tekstur Tanah   : [Lempung ▾]
[ ] Drainase        : [Baik ▾]
```

> 💡 Kalau mau minimal tapi tetap berguna: cukup wajibkan **Tekstur** dan **Drainase**, karena dua-duanya bisa diketahui tanpa alat khusus (diraba / diamati setelah hujan). pH dan suhu tanah dibiarkan opsional penuh karena butuh alat ukur (kertas lakmus, termometer tanah).

#### 2. Inference Engine (Forward Chaining)
- Evaluasi seluruh 39 rules secara sekuensial (24 wajib + 15 opsional kualitas tanah)
- Akumulasi skor per tanaman dari setiap rule yang terpenuhi
- Ranking otomatis berdasarkan total skor

#### 3. Halaman Hasil Rekomendasi
- Ranking tanaman dari yang paling direkomendasikan
- Label otomatis: **Sangat Direkomendasikan** / **Direkomendasikan** / **Cukup Sesuai**
- Skor numerik per tanaman

#### 4. Explanation Facility
- Daftar rules yang aktif (fired rules) pada sesi konsultasi tersebut
- Per tanaman: ditampilkan rules mana saja yang berkontribusi beserta alasan teksnya
- Ini yang membedakan sistem pakar dari kalkulator biasa — keputusan transparan dan dapat dijelaskan

#### 5. Konsultasi Ulang
- Tombol reset untuk kembali ke form awal
- State form dibersihkan penuh

### Fitur Tambahan (Nilai Lebih)

#### 6. Visualisasi Skor
- Bar chart horizontal perbandingan skor semua tanaman menggunakan Chart.js
- Warna berbeda per tanaman

#### 7. Halaman Knowledge Base
- Tabel semua 39 rules yang dapat dilihat publik (24 wajib + 15 opsional kualitas tanah)
- Dikelompokkan per kategori: Lingkungan, Pemilik, Keuangan, Tujuan
- Menampilkan ID rule, kondisi, tanaman yang terpengaruh, dan alasan

#### 8. Info Tanaman
- Per tanaman: deskripsi singkat, estimasi waktu panen, tips perawatan dasar
- Disimpan sebagai data statis di file `.ts`

#### 9. Log Riwayat Konsultasi
- Setiap sesi konsultasi disimpan ke database
- Halaman history menampilkan tabel: tanggal, jumlah rules aktif, tanaman teratas

#### 10. Export PDF
- Tombol download hasil konsultasi sebagai PDF menggunakan jsPDF
- Berisi: input user, ranking tanaman, rules aktif, alasan per tanaman

---

## 4. Setup & Instalasi

### Prasyarat

- Bun terinstall: `curl -fsSL https://bun.sh/install | bash`
- Akun Neon PostgreSQL: [neon.tech](https://neon.tech)
- Akun Vercel: [vercel.com](https://vercel.com)

### Langkah Setup

```bash
# 1. Buat project SvelteKit
bun create svelte@latest sistem-pakar
cd sistem-pakar

# Pilih: Skeleton project, TypeScript, Prettier, ESLint

# 2. Install dependencies
bun add drizzle-orm @neondatabase/serverless
bun add chart.js jspdf lucide-svelte
bun add -d drizzle-kit tailwindcss @tailwindcss/vite daisyui

# 3. Setup Tailwind CSS v4 & daisyUI
# (tambahkan plugin tailwindcss() di vite.config.ts dan plugin daisyUI di CSS)

# 4. Buat file .env
echo 'DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"' > .env

# 5. Push schema ke Neon
bunx drizzle-kit push

# 6. Jalankan dev server
bun dev
```

### File Konfigurasi Penting

**`vercel.json`** — aktifkan Bun Runtime:
```json
{
  "bunVersion": "1.x"
}
```

**`drizzle.config.ts`:**
```typescript
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

**`svelte.config.js`:**
```javascript
import adapter from "@sveltejs/adapter-vercel"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
  },
}
```

---

## 5. Deploy ke Vercel

### Langkah Deploy

```bash
# Install Vercel CLI via Bun
bun add -g vercel

# Login
vercel login

# Deploy (dari root project)
vercel deploy
```

### Atau via GitHub (Direkomendasikan)

1. Push project ke GitHub
2. Buka [vercel.com/new](https://vercel.com/new)
3. Import repository dari GitHub
4. Set environment variable: `DATABASE_URL` = connection string Neon
5. Vercel auto-detect SvelteKit dan build otomatis
6. Klik **Deploy**

### Environment Variables di Vercel

| Key | Value |
|---|---|
| `DATABASE_URL` | Connection string dari Neon dashboard |

### Catatan Bun di Vercel

Bun Runtime di Vercel tersedia sebagai **Public Beta** sejak Oktober 2025. Aktifkan dengan:

```json
// vercel.json
{
  "bunVersion": "1.x"
}
```

Vercel mengelola minor version Bun secara otomatis. `Bun.serve` belum didukung di Vercel Functions, tapi SvelteKit tidak menggunakannya — jadi tidak ada masalah.

---

## Referensi

- [SvelteKit Documentation](https://kit.svelte.dev)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Bun Runtime on Vercel](https://vercel.com/docs/functions/runtimes/bun)
- [Chart.js Documentation](https://www.chartjs.org/docs)
- [jsPDF Documentation](https://raw.githack.com/MrRio/jsPDF/master/docs)

---

*Dokumentasi ini dibuat untuk keperluan tugas kuliah Sistem Pakar — Universitas AKPRIND Indonesia.*
