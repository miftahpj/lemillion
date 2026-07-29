# Lemillion — Web Developer Portfolio
**Nuxt 3 · Tailwind CSS · Aiven for PostgreSQL**

Portfolio untuk **Miftah Pauzan Jamil (Lemillion)** — Web Developer di Tasikmalaya, berkarir sejak 2022.

---

## ⚡ Quick Start

```bash
npm install
npm run dev
```

Buka http://localhost:3000

---

## 🗄️ Setup Aiven for PostgreSQL (jalankan sekali)

1. Buat service **PostgreSQL** di [Aiven Console](https://console.aiven.io/) (paket gratis "Hobbyist" cukup untuk mulai).
2. Salin **Service URI** dari halaman *Overview* service kamu.
3. Isi `.env`:
   ```
   AIVEN_DATABASE_URL=postgres://avnadmin:xxxxx@xxxxx.aivencloud.com:xxxxx/defaultdb?sslmode=require
   ```
4. Jalankan schema & seed lewat `psql` (atau paste isinya ke Aiven Console → Query Editor):
   ```bash
   psql "$AIVEN_DATABASE_URL" -f aiven/01_schema.sql
   psql "$AIVEN_DATABASE_URL" -f aiven/02_seed.sql
   ```
5. Generate password admin untuk `/login`:
   ```bash
   node scripts/hash-password.mjs "password_kamu"
   ```
   Copy hasilnya ke `ADMIN_PASSWORD_HASH` di `.env`, dan set `SESSION_SECRET` ke string acak yang panjang.

---

## 📊 Arsitektur Data

Semua data (**profil, portfolio, services, testimonials, achievements, availability, inquiries**) disimpan di Aiven PostgreSQL dan diakses lewat API internal Nuxt (`server/api/*`) — bukan langsung dari browser. Ini lebih aman karena kredensial database tidak pernah sampai ke client.

```
Browser  →  /api/*  (Nuxt server routes, server/api/)  →  Aiven PostgreSQL (pg Pool)
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
AIVEN_DATABASE_URL=postgres://user:pass@host:port/db?sslmode=require
ADMIN_EMAIL=miftahpauzanjamil@gmail.com
ADMIN_PASSWORD_HASH=          # hasil dari scripts/hash-password.mjs
SESSION_SECRET=               # string acak panjang
```

---

## 📁 Struktur Proyek

```
aiven/              → SQL schema & seed untuk Aiven PostgreSQL
server/api/         → API routes (profile, portfolio, services, dll)
server/utils/       → koneksi DB (db.ts) & auth session (auth.ts)
composables/        → useSiteData, useProfile, usePortfolio, useInquiry, useAvailability, useAuth
pages/              → halaman publik + panel admin (/admin/*)
scripts/            → hash-password.mjs (generate ADMIN_PASSWORD_HASH)
```

---

## 🛠️ Deploy

Cocok untuk Vercel, Netlify, atau VPS apa saja yang mendukung Node.js (Nitro preset default `node-server`). Pastikan semua environment variable di atas diisi di dashboard hosting kamu, dan Aiven service kamu mengizinkan koneksi dari IP hosting (atau pakai opsi allow-all IP kalau memang publik).
