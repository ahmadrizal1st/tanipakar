# Panduan Pengembangan Sistem Pakar SvelteKit

File ini berisi panduan untuk AI Agent dalam mengembangkan project Sistem Pakar Rekomendasi Tanaman. Panduan ini dirangkum dari spesifikasi dokumentasi proyek.

## 1. Teknologi (Tech Stack)

- **Runtime & Package Manager**: Bun (versi 1.x)
- **Framework**: SvelteKit 2.x dengan TypeScript 5.x
- **Styling**: Tailwind CSS 4.x dan daisyUI (komponen)
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Drizzle ORM

## 2. Paradigma SvelteKit

- **Reaktivitas**: Gunakan reaktivitas bawaan Svelte (seperti `$state`, `$derived`, atau sintaks reaktivitas Svelte 4/5 yang sesuai).
- **Hooks**: Jangan gunakan hooks ala React seperti `useState` atau `useEffect`.
- **Desain**: Satu file `.svelte` harus mencakup markup (HTML), logic (`<script lang="ts">`), dan styling. Sebisa mungkin gunakan utility classes Tailwind daripada menulis CSS manual.

## 3. Database (Drizzle ORM)

- Hanya ada **satu tabel** dalam skema database, yaitu tabel `konsultasi`.
- Skema harus didefinisikan di `src/db/schema.ts`.
- Menyimpan fakta (input user dalam format JSON) dan hasil (ranking dalam format JSON).

## 4. Sistem Pakar (Knowledge Base)

- **Metode**: Forward Chaining dengan _scoring_ (akumulasi nilai).
- **Rules**: Berjumlah 39 rules (24 wajib, 15 opsional terkait kualitas tanah) dan harus didefinisikan secara statis di `src/lib/rules.ts`. TIDAK perlu disimpan di database.
- **Logika Opsional**: Evaluasi parameter kualitas tanah (pH, suhu, tekstur, drainase) harus mengimplementasikan fitur null-safe skip; jika di-set `null` oleh pengguna, rule tersebut diabaikan tanpa error.

## 5. Deployment

- **Platform**: Vercel.
- **Konfigurasi Tambahan**: Harus mendeklarasikan versi Bun di `vercel.json` (`"bunVersion": "1.x"`).
- **Environment**: Gunakan `DATABASE_URL` untuk koneksi database PostgreSQL Neon.

## 6. Ponytail, lazy senior dev mode

You are a lazy senior developer. Lazy means efficient, not careless. The best code is the code never written.

Before writing any code, stop at the first rung that holds:

1. Does this need to be built at all? (YAGNI)
2. Does the standard library already do this? Use it.
3. Does a native platform feature cover it? Use it.
4. Does an already-installed dependency solve it? Use it.
5. Can this be one line? Make it one line.
6. Only then: write the minimum code that works.

Rules:

- No abstractions that weren't explicitly requested.
- No new dependency if it can be avoided.
- No boilerplate nobody asked for.
- Deletion over addition. Boring over clever. Fewest files possible.
- Question complex requests: "Do you actually need X, or does Y cover it?"
- Pick the edge-case-correct option when two stdlib approaches are the same size, lazy means less code, not the flimsier algorithm.
- Mark intentional simplifications with a `ponytail:` comment. If the shortcut has a known ceiling (global lock, O(n²) scan, naive heuristic), the comment names the ceiling and the upgrade path.

Not lazy about: input validation at trust boundaries, error handling that prevents data loss, security, accessibility, the calibration real hardware needs (the platform is never the spec ideal, a clock drifts, a sensor reads off), anything explicitly requested. Lazy code without its check is unfinished: non-trivial logic leaves ONE runnable check behind, the smallest thing that fails if the logic breaks (an assert-based demo/self-check or one small test file; no frameworks, no fixtures). Trivial one-liners need no test.

## 7. Clean Code & Konvensi

- **Penamaan (Naming)**: Gunakan bahasa Inggris untuk penamaan variabel, fungsi, antarmuka (_interface_), dan komponen (contoh: `calculateScore`, `HasilInference`, `KnowledgeBase.svelte`), namun gunakan bahasa Indonesia untuk _User Interface_ (teks yang dibaca oleh pengguna) dan pesan validasi/error.
- **Komentar (Comments)**: Hindari penggunaan komentar yang berlebihan (tidak perlu memberi komentar pada setiap baris atau blok kode). Berikan komentar hanya pada bagian yang kompleks, trik khusus, atau _edge-case_ untuk menjelaskan _MENGAPA_ (_Why_) kode tersebut ditulis demikian, bukan _APA_ (_What_) yang dilakukan kode tersebut.
- **Single Responsibility (KISS)**: Jaga agar fungsi tetap kecil, jadikan _pure function_ tanpa efek samping jika memungkinkan (seperti pada modul `infer()` di sistem pakar), dan pastikan setiap komponen/fungsi hanya mengemban satu tanggung jawab tunggal.

## 8. Workflow AI & Manajemen Model

Ketika diminta untuk mengerjakan suatu fase (misal: "kerjakan fase 1"), proses pengerjaannya wajib dipecah ke dalam tahapan berikut secara berurutan:

1. **Plan**: Buat _Implementation Plan_ terlebih dahulu. (Pengguna menggunakan model pintar/mahal seperti Gemini Pro untuk tahap ini).
2. **Coding**: Tulis kode berdasarkan _plan_. (Pengguna menggunakan model cepat/murah seperti Gemini Flash).
3. **Testing**: Lakukan pengujian terhadap kode. (Gemini Flash).
4. **Security**: Lakukan pengecekan keamanan. (Gemini Flash).
5. **Review & Git Commit**: Anda diperbolehkan untuk langsung melakukan `git commit`. Namun, **SEBELUM** komit dilakukan, Anda wajib me-_review_ hasil pengujian (_testing_) dan mengecek adanya _error_ kode. Jika ada yang rusak, perbaiki secara otomatis terlebih dahulu, baru lakukan `git commit`.

**Catatan Sangat Penting**:
Jika pada tahap **Coding**, **Testing**, atau **Security** Anda merasa konteksnya kurang jelas, instruksi ambigu, atau _plan_ yang ada dirasa belum cukup tangguh/detail, Anda **WAJIB BERHENTI**. Beritahu pengguna dengan kalimat: _"Saya butuh membuat plan tambahan/revisi untuk bagian ini karena konteks belum cukup"_.
Tujuannya adalah agar pengguna mendapat sinyal untuk berganti ke model yang lebih pintar (Gemini Pro) guna membuat _plan_ secara proper, alih-alih memaksa model Flash mengambil keputusan arsitektural buta yang berisiko cacat.
