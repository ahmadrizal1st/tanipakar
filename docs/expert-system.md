# Knowledge Base & Inference Engine

## 1. Knowledge Base & Rules

Rules bersifat **statis** — disimpan di file `src/lib/rules.ts`. Tidak disimpan di database karena rules domain pakar bersifat tetap dan sudah divalidasi.

Total: **39 rules** — 24 rules wajib dari 4 kategori + 15 rules opsional dari sub-kategori kualitas tanah.

---

### Kategori 1: Kondisi Lingkungan (8 Rules Wajib + 15 Rules Opsional Kualitas Tanah)

**Sub-kategori: Lahan & Cahaya**

| ID | Kondisi | Tanaman yang Mendapat Skor |
|---|---|---|
| R01 | Luas ≥ 10m² AND matahari = penuh | Cabai +2, Tomat +2, Terong +2 |
| R02 | Luas < 10m² AND matahari = penuh | Cabai +2, Daun Bawang +1 |
| R03 | Matahari = sebagian (3–6 jam) | Kangkung +2, Daun Bawang +2 |
| R04 | Matahari = teduh (<3 jam) | Kangkung +1 |

**Sub-kategori: Air**

| ID | Kondisi | Tanaman yang Mendapat Skor |
|---|---|---|
| R05 | Air = mudah tersedia | Semua tanaman +1 |
| R06 | Air = terbatas (hanya hujan) | Cabai +1, Daun Bawang +1 |

**Sub-kategori: Media Tanam**

| ID | Kondisi | Tanaman yang Mendapat Skor |
|---|---|---|
| R07 | Media = tanah langsung | Tomat +1, Terong +1, Cabai +1 |
| R08 | Media = pot/polybag | Cabai +2, Daun Bawang +2, Kangkung +1 |

**Sub-kategori: Kualitas Tanah — Opsional** *(hanya aktif jika data diisi)*

> Parameter ini opsional. Jika tidak diisi, rules di bawah tidak dievaluasi dan tidak mempengaruhi skor. Direkomendasikan mengisi minimal **tekstur** dan **drainase** karena dapat diamati tanpa alat khusus.

| Parameter | Cara Mengetahui | Alat |
|---|---|---|
| pH tanah | Kertas lakmus / soil tester | Murah, tersedia di toko pertanian |
| Suhu tanah | Termometer tanah | Opsional |
| Tekstur tanah | Diraba — berpasir / lempung / liat | Tidak butuh alat |
| Drainase | Amati setelah hujan — cepat meresap atau menggenang | Tidak butuh alat |

*Rules pH Tanah:*

| ID | Kondisi | Tanaman yang Mendapat Skor |
|---|---|---|
| R_PH1 | pH 6.0–6.5 | Cabai +2, Tomat +2, Kangkung +1 |
| R_PH2 | pH 6.5–7.0 | Tomat +2, Terong +2, Daun Bawang +1 |
| R_PH3 | pH < 5.5 (sangat asam) | Kangkung +2 (paling toleran asam) |
| R_PH4 | pH > 7.5 (basa) | Daun Bawang +1 |

*Rules Suhu Tanah:*

| ID | Kondisi | Tanaman yang Mendapat Skor |
|---|---|---|
| R_SU1 | Suhu 20–25°C | Kangkung +2, Daun Bawang +2 |
| R_SU2 | Suhu 25–30°C | Cabai +2, Tomat +2, Terong +2 |
| R_SU3 | Suhu > 32°C | Cabai +1 (paling toleran panas) |
| R_SU4 | Suhu < 18°C | Daun Bawang +1 |

*Rules Tekstur Tanah:*

| ID | Kondisi | Tanaman yang Mendapat Skor |
|---|---|---|
| R_TX1 | Tekstur = lempung berpasir | Cabai +2, Tomat +2, Terong +1 |
| R_TX2 | Tekstur = lempung | Semua tanaman +1 |
| R_TX3 | Tekstur = pasir (drainase cepat) | Cabai +1, Daun Bawang +1 |
| R_TX4 | Tekstur = liat | Kangkung +2 (suka lembab) |

*Rules Drainase:*

| ID | Kondisi | Tanaman yang Mendapat Skor |
|---|---|---|
| R_DR1 | Drainase = baik | Cabai +2, Tomat +2, Terong +1 |
| R_DR2 | Drainase = sedang | Semua tanaman +1 |
| R_DR3 | Drainase = buruk / tergenang | Kangkung +3 |

---

### Kategori 2: Kondisi Pemilik (6 Rules)

| ID | Kondisi | Tanaman yang Mendapat Skor |
|---|---|---|
| R09 | Waktu perawatan = sibuk (<30 mnt/hari) | Kangkung +2, Daun Bawang +2 |
| R10 | Waktu perawatan = cukup (>30 mnt/hari) | Semua tanaman +1 |
| R11 | Pengalaman = pemula | Kangkung +2, Daun Bawang +2, Cabai +1 |
| R12 | Pengalaman = berpengalaman | Cabai +1, Tomat +2, Terong +2 |
| R13 | Ada anak kecil di rumah | Tomat +2, Kangkung +1 |
| R14 | Jumlah anggota keluarga ≥ 4 orang | Kangkung +2, Daun Bawang +2 |

---

### Kategori 3: Kondisi Keuangan (5 Rules)

| ID | Kondisi | Tanaman yang Mendapat Skor |
|---|---|---|
| R15 | Budget = rendah (<200rb) | Kangkung +3, Daun Bawang +3 |
| R16 | Budget = sedang (200rb–500rb) | Cabai +2, Tomat +2, Kangkung +1, Daun Bawang +1 |
| R17 | Budget = tinggi (>500rb) | Cabai +2, Tomat +2, Terong +3 |
| R18 | Tujuan finansial = hemat belanja | Cabai +2, Daun Bawang +2, Kangkung +2 |
| R19 | Tujuan finansial = jual hasil | Cabai +3, Tomat +3 |

---

### Kategori 4: Tujuan (5 Rules)

| ID | Kondisi | Tanaman yang Mendapat Skor |
|---|---|---|
| R20 | Tujuan = konsumsi sendiri | Cabai +1, Tomat +1, Kangkung +1, Daun Bawang +1 |
| R21 | Tujuan = estetika/dekorasi | Cabai +2, Tomat +2 |
| R22 | Tujuan = edukasi anak | Kangkung +3, Tomat +1 |
| R23 | Tujuan = ketahanan pangan | Kangkung +2, Daun Bawang +2, Cabai +1, Tomat +1 |
| R24 | Tujuan = bisnis/jual | Cabai +3, Tomat +3, Terong +1 |

---

## 2. Inference Engine

### Metode: Forward Chaining dengan Scoring

**Konsep dasar:** mulai dari fakta (input user) → cocokkan dengan rules → hasilkan kesimpulan (rekomendasi).

```typescript
// src/lib/inference.ts

export interface Fakta {
  luas: number
  matahari: "penuh" | "sebagian" | "teduh"
  air: "mudah" | "terbatas"
  tanah: "subur" | "pot"
  waktu: "sibuk" | "cukup"
  pengalaman: "pemula" | "berpengalaman"
  ada_anak: boolean
  jumlah_anggota: number
  budget: "rendah" | "sedang" | "tinggi"
  tujuan_finansial: "hemat" | "jual"
  tujuan: "konsumsi" | "estetika" | "edukasi" | "pangan" | "bisnis"

  // Kualitas tanah — opsional, null kalau tidak diisi user
  ph: number | null
  suhu_tanah: number | null
  tekstur: "lempung_berpasir" | "lempung" | "pasir" | "liat" | null
  drainase: "baik" | "sedang" | "buruk" | null
}

export interface HasilInference {
  ranked: {
    plant: string
    label: string
    image: string
    score: number
    level: string
    contributors: Rule[]
  }[]
  firedRules: Rule[]
  scores: Record<string, number>
}

export function infer(fakta: Fakta): HasilInference {
  // 1. Inisialisasi skor semua tanaman = 0
  const scores = Object.fromEntries(PLANTS.map(p => [p, 0]))
  const firedRules: Rule[] = []

  // 2. Evaluasi semua rules
  rules.forEach(rule => {
    if (rule.condition(fakta)) {
      firedRules.push(rule)
      Object.entries(rule.score).forEach(([plant, val]) => {
        scores[plant] += val
      })
    }
  })

  // 3. Ranking berdasarkan skor
  const maxScore = Math.max(...Object.values(scores))
  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score > 0)
    .map(([plant, score]) => ({
      plant,
      label: PLANT_LABELS[plant],
      image: `/images/${plant}.webp`,
      score,
      level: getLevel(score, maxScore),
      contributors: firedRules.filter(r => r.score[plant])
    }))

  return { ranked, firedRules, scores }
}

function getLevel(score: number, maxScore: number): string {
  const ratio = score / maxScore
  if (ratio >= 0.7) return "Sangat Direkomendasikan"
  if (ratio >= 0.4) return "Direkomendasikan"
  return "Cukup Sesuai"
}
```

### Rules Opsional — Null-Safe Skip

Rules kualitas tanah ditulis dengan null check di bagian `condition`. Kalau field-nya tidak diisi user (`null`), kondisi langsung `false` sehingga rule tidak fired dan tidak mempengaruhi skor sama sekali — tidak perlu logic percabangan tambahan di inference engine.

```typescript
// src/lib/rules.ts
{
  id: "R_PH1",
  condition: (f) => f.ph !== null && f.ph >= 6.0 && f.ph <= 6.5,
  score: { cabai: 2, tomat: 2, kangkung: 1 },
  alasan: "pH 6.0–6.5 optimal untuk cabai dan tomat."
}
```

Kalau `f.ph === null` → `condition` langsung `false` → rule tidak aktif → tidak masuk ke `firedRules` → tidak mempengaruhi skor. Pola yang sama dipakai untuk `suhu_tanah`, `tekstur`, dan `drainase`.

### Contoh Skenario

**Input:**
- Luas: 12m², Matahari: penuh, Air: mudah, Tanah: subur
- Waktu: cukup, Pengalaman: pemula, Ada anak: tidak, Anggota: 4
- Budget: sedang, Tujuan finansial: hemat, Tujuan: konsumsi

**Rules yang aktif:** R01, R05, R07, R10, R11, R14, R16, R18, R20 (9 dari 24 rules wajib — kualitas tanah tidak diisi pada skenario ini, jadi 15 rules opsional tidak dievaluasi)

**Skor hasil:**

| Tanaman | Skor | Level |
|---|---|---|
| Kangkung | 8 | Sangat Direkomendasikan |
| Daun Bawang | 7 | Sangat Direkomendasikan |
| Cabai | 7 | Sangat Direkomendasikan |
| Tomat | 6 | Direkomendasikan |
| Terong | 4 | Cukup Sesuai |
