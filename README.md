# Lemillion — Web Developer Portfolio
**Nuxt 3 · Tailwind CSS · Neon PostgreSQL**

Portfolio untuk **Miftah Pauzan Jamil (Lemillion)** — Web Developer di Tasikmalaya, berkarir sejak 2022.

---

## ⚡ Quick Start

```bash
npm install
npm run dev
```

Buka http://localhost:3000

---

## 🗄️ Setup Neon PostgreSQL (jalankan sekali)

1. Buat project di [Neon Console](https://console.neon.tech/) (free tier cukup untuk mulai).
2. Salin **Connection string** dari dashboard project kamu (pilih yang *pooled connection* kalau mau deploy ke Vercel/serverless).
3. Isi `.env`:
   ```
   DATABASE_URL=postgres://user:xxxxx@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. Jalankan schema & seed lewat `psql` (atau paste isinya ke Neon Console → SQL Editor):
   ```bash
   psql "$DATABASE_URL" -f neon/01_schema.sql
   psql "$DATABASE_URL" -f neon/02_seed.sql
   ```
5. Generate password admin untuk `/login`:
   ```bash
   node scripts/hash-password.mjs "password_kamu"
   ```
   Copy hasilnya ke `ADMIN_PASSWORD_HASH` di `.env`, dan set `SESSION_SECRET` ke string acak yang panjang.

---

## 📊 Arsitektur Data

Semua data (**profil, portfolio, services, testimonials, achievements, availability, inquiries**) disimpan di Neon PostgreSQL dan diakses lewat API internal Nuxt (`server/api/*`) — bukan langsung dari browser. Ini lebih aman karena kredensial database tidak pernah sampai ke client.

```
Browser  →  /api/*  (Nuxt server routes, server/api/)  →  Neon PostgreSQL (pg Pool)
```

- **Publik** (GET): profile, portfolio, categories, services, testimonials, awards, availability — tidak perlu login.
- **Admin** (PUT/PATCH/POST/DELETE): dilindungi cookie session yang ditandatangani (`server/utils/auth.ts`), diset lewat halaman `/login`.
- **Form kontak** publik (`POST /api/inquiries`) menyimpan pesan masuk ke tabel `inquiries`, dikelola di `/admin/inquiries`.

### Struktur tabel utama
| Tabel | Isi |
|---|---|
| `profile`      | Data diri (nama, bio, kontak, GitHub/LinkedIn, statistik) |
| `categories`   | Kategori proyek (Landing Page, Company Profile, Web App, dll) |
| `portfolio`    | Daftar proyek — termasuk `tech_stack`, `repo_url`, `demo_url` |
| `services`     | Jasa & pricing |
| `testimonials` | Testimoni klien |
| `awards`       | Pencapaian & sertifikasi |
| `inquiries`    | Pesan masuk dari form contact |
| `availability` | Status ketersediaan proyek per bulan |

Gambar (screenshot proyek, foto profil) **bukan** disimpan sebagai file upload — cukup isi kolom `*_url` dengan link gambar (mis. hasil upload ke imgur/Cloudinary/GitHub, atau taruh filenya di folder `public/` dan pakai path `/nama-file.jpg`).

---

## 🚀 Kenapa Web Ini Ringan

- **Tanpa library AOS** — animasi scroll pakai `IntersectionObserver` bawaan browser (`plugins/reveal.client.ts`), bukan library eksternal ±13KB.
- **Font ditrim** — cuma weight yang benar-benar dipakai (Cinzel 500/700, DM Sans 400/500, Space Mono 400/700). Font italic serif pakai system font (Georgia), jadi nggak perlu download font tambahan sama sekali.
- **Route caching (`swr`)** — halaman publik di-cache di edge/server beberapa menit, jadi kunjungan berulang nyaris instan tanpa hit database setiap saat.
- **Lazy loading gambar** di semua galeri/portfolio.
- **Kompresi asset otomatis** lewat Nitro (`compressPublicAssets`).

---

## 🔑 Environment Variables (`.env`)

```env
DATABASE_URL=postgres://user:pass@host:port/db?sslmode=require
ADMIN_EMAIL=miftahpauzanjamil@gmail.com
ADMIN_PASSWORD_HASH=          # hasil dari scripts/hash-password.mjs
SESSION_SECRET=               # string acak panjang
```

---

## 📁 Struktur Proyek

```
neon/               → SQL schema & seed untuk Neon PostgreSQL
server/api/         → API routes (profile, portfolio, services, dll)
server/utils/       → koneksi DB (db.ts) & auth session (auth.ts)
composables/        → useSiteData, useProfile, usePortfolio, useInquiry, useAvailability, useAuth
pages/              → halaman publik + panel admin (/admin/*)
scripts/            → hash-password.mjs (generate ADMIN_PASSWORD_HASH)
```

---

---

## 🔍 SEO

Website ini sudah dilengkapi:
- **Meta tags lengkap** (title, description, keywords, Open Graph, Twitter Card) — title & description tiap halaman menyebut nama lengkap **"Miftah Pauzan Jamil"** dan alias **"Lemillion"**.
- **JSON-LD structured data** (`Person` + `WebSite`, di `app.vue`) supaya Google bisa menampilkan rich result / knowledge panel untuk pencarian nama.
- **`robots.txt`** (`public/robots.txt`) — izinkan crawl semua halaman publik, blok `/admin` dan `/login`.
- **`sitemap.xml`** dinamis (`server/routes/sitemap.xml.ts`) — otomatis include semua proyek portfolio yang published, tanpa perlu rebuild.

Setelah deploy, daftarkan `https://miftahpj.web.id` ke [Google Search Console](https://search.google.com/search-console) dan submit `sitemap.xml`-nya supaya lebih cepat terindex untuk pencarian "Miftah Pauzan Jamil".

---

## 🛠️ Deploy

Cocok untuk Vercel, Netlify, atau VPS apa saja yang mendukung Node.js (Nitro preset default `node-server`). Pastikan semua environment variable di atas diisi di dashboard hosting kamu. Neon otomatis publicly accessible (tidak perlu allowlist IP seperti Aiven), tapi kalau deploy ke platform serverless (Vercel/Netlify functions), pakai *pooled connection string* Neon (yang ada akhiran `-pooler` di hostname) supaya tidak cepat kehabisan slot koneksi.
