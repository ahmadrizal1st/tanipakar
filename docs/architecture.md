# Arsitektur & API Sistem

## 1. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                 │
│                                                     │
│   ┌──────────────┐        ┌──────────────────────┐  │
│   │ Form Input   │──────▶ │  Hasil Rekomendasi   │  │
│   │ (Wizard)     │        │  + Explanation       │  │
│   └──────────────┘        └──────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │ POST /api/konsultasi
                     ▼
┌─────────────────────────────────────────────────────┐
│              SERVER (SvelteKit + Bun)               │
│                                                     │
│   ┌──────────────────────────────────────────────┐  │
│   │              Inference Engine                │  │
│   │         (Forward Chaining Logic)             │  │
│   └──────────────────────────────────────────────┘  │
│                      │                              │
│   ┌──────────────────┴───────────────────────────┐  │
│   │             Knowledge Base                   │  │
│   │   (39 Rules — 24 wajib + 15 opsional)        │  │
│   └──────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────┘
                      │ Insert log
                      ▼
┌─────────────────────────────────────────────────────┐
│              Neon PostgreSQL (Cloud)                │
│                                                     │
│   Tabel: konsultasi                                 │
│   - id, fakta (JSON), hasil (JSON), created_at      │
└─────────────────────────────────────────────────────┘
```

### Alur Data

```
1. User mengisi form wizard (4 kategori input)
       ↓
2. Form submit → POST /api/konsultasi
       ↓
3. Server terima fakta → jalankan infer(fakta)
       ↓
4. Inference engine evaluasi semua 39 rules (15 rules kualitas tanah otomatis di-skip kalau datanya tidak diisi)
       ↓
5. Rules yang kondisinya terpenuhi → akumulasi skor per tanaman
       ↓
6. Hasil di-ranking berdasarkan total skor
       ↓
7. Log disimpan ke Neon PostgreSQL
       ↓
8. Response JSON dikirim ke client
       ↓
9. Halaman hasil menampilkan ranking + alasan + chart
```

---

## 2. Struktur Project

```
sistem-pakar/
├── src/
│   ├── routes/
│   │   ├── +page.svelte              # Halaman utama — form wizard
│   │   ├── +layout.svelte            # Layout global (navbar, footer)
│   │   ├── hasil/
│   │   │   └── +page.svelte          # Halaman hasil rekomendasi
│   │   ├── knowledge-base/
│   │   │   └── +page.svelte          # Tabel semua rules
│   │   ├── history/
│   │   │   └── +page.svelte          # Riwayat konsultasi dari DB
│   │   └── api/
│   │       └── konsultasi/
│   │           └── +server.ts        # POST endpoint — inference + simpan log
│   │
│   ├── lib/
│   │   ├── rules.ts                  # Knowledge base (array 39 rules: 24 wajib + 15 opsional)
│   │   ├── inference.ts              # Forward chaining engine
│   │   ├── plants.ts                 # Data info tanaman (deskripsi, tips)
│   │   └── db.ts                     # Drizzle + Neon connection
│   │
│   ├── db/
│   │   └── schema.ts                 # Drizzle schema
│   │
│   └── components/
│       ├── FormStep1Lingkungan.svelte
│       ├── FormStep2Pemilik.svelte
│       ├── FormStep3Keuangan.svelte
│       ├── FormStep4Tujuan.svelte
│       ├── HasilKartu.svelte         # Card per tanaman di halaman hasil
│       ├── SkorChart.svelte          # Bar chart skor (Chart.js)
│       └── ExportPDF.svelte          # Tombol export jsPDF
│
├── drizzle/
│   └── migrations/                   # Auto-generated oleh drizzle-kit
│
├── static/
│   └── favicon.png
│
├── drizzle.config.ts
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.ts
├── vercel.json
├── .env
└── package.json
```

---

## 3. Skema Database

Hanya 1 tabel — untuk log setiap sesi konsultasi.

```typescript
// src/db/schema.ts
import { pgTable, uuid, jsonb, integer, timestamp } from "drizzle-orm/pg-core"

export const konsultasi = pgTable("konsultasi", {
  id:           uuid("id").defaultRandom().primaryKey(),
  fakta:        jsonb("fakta").notNull(),        // input user as JSON
  hasil:        jsonb("hasil").notNull(),         // ranked results as JSON
  rules_aktif:  integer("rules_aktif"),           // jumlah rules yang fired
  created_at:   timestamp("created_at").defaultNow(),
})
```

**Kenapa rules tidak disimpan di DB?**

Rules bersifat statis — tidak berubah setiap saat. Menyimpan rules di DB hanya worth it kalau ada admin panel untuk mengelolanya. Untuk tugas kuliah ini, menyimpan di file `.ts` lebih sederhana, lebih cepat, dan lebih mudah didokumentasikan untuk laporan.

---

## 4. API Endpoint

### POST `/api/konsultasi`

Menerima fakta dari form, menjalankan inference, menyimpan log, dan mengembalikan hasil.

```typescript
// src/routes/api/konsultasi/+server.ts
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { infer } from "$lib/inference"
import { db } from "$lib/db"
import { konsultasi } from "$db/schema"

export const POST: RequestHandler = async ({ request }) => {
  const fakta = await request.json()

  // Jalankan inference engine
  const hasil = infer(fakta)

  // Simpan log ke Neon PostgreSQL
  await db.insert(konsultasi).values({
    fakta,
    hasil: hasil.ranked,
    rules_aktif: hasil.firedRules.length,
  })

  return json(hasil)
}
```

**Request body:**
```json
{
  "luas": 12,
  "matahari": "penuh",
  "air": "mudah",
  "tanah": "subur",
  "waktu": "cukup",
  "pengalaman": "pemula",
  "ada_anak": false,
  "jumlah_anggota": 4,
  "budget": "sedang",
  "tujuan_finansial": "hemat",
  "tujuan": "konsumsi",
  "ph": 6.5,
  "suhu_tanah": null,
  "tekstur": "lempung",
  "drainase": "baik"
}
```

> Field kualitas tanah (`ph`, `suhu_tanah`, `tekstur`, `drainase`) bersifat opsional — kirim `null` kalau user tidak mengisi field tersebut di form.

**Response:**
```json
{
  "ranked": [
    {
      "plant": "kangkung",
      "label": "Kangkung",
      "image": "/images/kangkung.webp",
      "score": 8,
      "level": "Sangat Direkomendasikan",
      "contributors": [...]
    }
  ],
  "firedRules": [...],
  "scores": {
    "cabai": 7,
    "tomat": 6,
    "terong": 4,
    "kangkung": 8,
    "daun_bawang": 7
  }
}
```
