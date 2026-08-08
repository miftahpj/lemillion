-- ====================================================
-- LEMILLION — Seed Data untuk Neon PostgreSQL
-- Jalankan SETELAH 01_schema.sql:
-- psql "$DATABASE_URL" -f neon/02_seed.sql
-- ====================================================

-- Profile
INSERT INTO profile (name, tagline, bio, bio_extended, location, email, whatsapp, github, linkedin, years_experience, projects_count, certifications_count, clients_count)
VALUES (
  'Miftah Pauzan Jamil',
  'Web Developer',
  'Membangun website yang cepat, rapi, dan enak dipakai — dari landing page sampai sistem informasi.',
  'Berbasis di Tasikmalaya, aku berkarir sebagai web developer sejak 2022. Fokus utamaku membangun website yang ringan, responsif, dan mudah dikembangkan — mulai dari landing page, company profile, hingga web app dan sistem informasi custom.

Setiap proyek aku kerjakan dengan pendekatan yang sama: performa yang baik di semua perangkat, kode yang terstruktur, dan komunikasi yang jelas dengan klien dari awal sampai website live.',
  'Tasikmalaya, Indonesia',
  'miftahpauzanjamil@gmail.com',
  '+6281234567890',
  'lemillion',
  'miftah-pauzan-jamil',
  4, 20, 4, 15
);

-- Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Landing Page',   'landing-page',   'Landing page cepat untuk produk, campaign, dan personal brand', 1),
  ('Company Profile','company-profile','Website profil perusahaan dan portofolio bisnis', 2),
  ('Web App',        'web-app',        'Aplikasi web dan sistem informasi custom', 3),
  ('E-Commerce',     'e-commerce',     'Toko online dan platform jual-beli', 4),
  ('API & Backend',  'api-backend',    'REST API dan layanan backend', 5);

-- Portfolio
INSERT INTO portfolio (title, slug, category_id, description, cover_url, image_url, tags, year, is_featured, sort_order, client, tech_stack, role, repo_url, demo_url) VALUES
  ('Sistem Informasi Akademik Sekolah', 'sistem-informasi-akademik',
    (SELECT id FROM categories WHERE slug='web-app'),
    'Sistem informasi untuk mengelola data siswa, nilai, dan jadwal pelajaran sebuah sekolah menengah di Tasikmalaya.',
    '', '', ARRAY['sistem informasi','sekolah','dashboard'], 2025, TRUE, 1,
    'SMK Swasta, Tasikmalaya', 'Laravel, MySQL, Tailwind CSS', 'Full-stack Developer', '', ''),

  ('Landing Page Peluncuran Produk Lokal', 'landing-page-produk-lokal',
    (SELECT id FROM categories WHERE slug='landing-page'),
    'Landing page untuk kampanye peluncuran produk UMKM dengan fokus konversi dan kecepatan loading.',
    '', '', ARRAY['landing page','umkm','konversi'], 2024, TRUE, 2,
    'UMKM Lokal', 'Nuxt 3, Tailwind CSS', 'Frontend Developer', '', ''),

  ('Company Profile Biro Jasa', 'company-profile-biro-jasa',
    (SELECT id FROM categories WHERE slug='company-profile'),
    'Website profil perusahaan untuk biro jasa dengan halaman layanan, portofolio klien, dan formulir kontak.',
    '', '', ARRAY['company profile','bisnis','portofolio'], 2024, TRUE, 3,
    'Biro Jasa Tasikmalaya', 'Nuxt 3, PostgreSQL, Tailwind CSS', 'Full-stack Developer', '', ''),

  ('Toko Online Fashion Lokal', 'toko-online-fashion',
    (SELECT id FROM categories WHERE slug='e-commerce'),
    'Platform toko online sederhana untuk brand fashion lokal, lengkap dengan katalog produk dan checkout via WhatsApp.',
    '', '', ARRAY['e-commerce','fashion','whatsapp checkout'], 2024, FALSE, 4,
    'Brand Fashion Lokal', 'Vue 3, Node.js, Express, MongoDB', 'Full-stack Developer', '', ''),

  ('REST API Manajemen Inventaris', 'rest-api-inventaris',
    (SELECT id FROM categories WHERE slug='api-backend'),
    'REST API untuk pencatatan stok barang, mendukung otentikasi JWT dan role-based access.',
    '', '', ARRAY['api','backend','inventaris'], 2023, TRUE, 5,
    NULL, 'Node.js, Express, PostgreSQL, JWT', 'Backend Developer', '', ''),

  ('Portofolio Digital Fotografer', 'portofolio-digital-fotografer',
    (SELECT id FROM categories WHERE slug='company-profile'),
    'Website portofolio untuk seorang fotografer lepas, dengan galeri kategori dan form booking sesi foto.',
    '', '', ARRAY['portofolio','galeri','booking'], 2023, FALSE, 6,
    'Fotografer Lepas', 'Nuxt 3, Neon PostgreSQL, Tailwind CSS', 'Full-stack Developer', '', ''),

  ('Landing Page Event Komunitas', 'landing-page-event-komunitas',
    (SELECT id FROM categories WHERE slug='landing-page'),
    'Landing page pendaftaran untuk acara komunitas lokal, dengan countdown dan integrasi form pendaftaran.',
    '', '', ARRAY['landing page','event','komunitas'], 2022, FALSE, 7,
    'Komunitas Lokal', 'HTML, Tailwind CSS, JavaScript', 'Frontend Developer', '', ''),

  ('Dashboard Monitoring Sederhana', 'dashboard-monitoring',
    (SELECT id FROM categories WHERE slug='web-app'),
    'Dashboard internal untuk memantau data operasional harian sebuah usaha kecil.',
    '', '', ARRAY['dashboard','web app','data'], 2022, FALSE, 8,
    NULL, 'Vue 3, Chart.js, MySQL', 'Frontend Developer', '', '');

-- Services
INSERT INTO services (title, icon, description, price_min, price_label, duration, features, is_featured, sort_order) VALUES
  ('Landing Page', '🚀', 'Website satu halaman untuk produk, campaign, atau personal brand — fokus cepat dan konversi tinggi.',
    500000, 'Mulai dari', '3–5 hari kerja',
    ARRAY['Desain responsif','1–2 kali revisi','Optimasi kecepatan','Form kontak / WhatsApp','Setup domain & hosting'],
    TRUE, 1),

  ('Company Profile', '🏢', 'Website profil perusahaan lengkap dengan halaman layanan, tentang kami, dan portofolio.',
    1500000, 'Mulai dari', '1–2 minggu',
    ARRAY['5–7 halaman','Desain custom','SEO dasar','Formulir kontak','Panel admin sederhana'],
    TRUE, 2),

  ('Web App / Sistem Informasi', '⚙️', 'Aplikasi web custom sesuai kebutuhan bisnis — dashboard, manajemen data, hingga sistem informasi.',
    3000000, 'Mulai dari', '2–6 minggu',
    ARRAY['Analisis kebutuhan','Database custom','Panel admin','Autentikasi & role akses','Dukungan pasca-launching'],
    TRUE, 3),

  ('Maintenance & Optimasi', '🛠️', 'Perawatan berkala, perbaikan bug, dan optimasi performa untuk website yang sudah berjalan.',
    200000, 'Mulai dari', 'Per bulan',
    ARRAY['Update konten & konten','Monitoring performa','Perbaikan bug','Backup berkala'],
    FALSE, 4);

-- Testimonials
INSERT INTO testimonials (client_name, client_role, quote, rating, is_featured, sort_order) VALUES
  ('Rian Hidayat', 'Pemilik UMKM · 2024', 'Landing page yang dibuat Miftah bikin produk kami jauh lebih mudah dijelaskan ke calon pembeli. Loadingnya cepat banget.', 5, TRUE, 1),
  ('Sinta Amelia', 'Owner Biro Jasa · 2024', 'Komunikasinya enak, progressnya jelas, dan hasil akhirnya sesuai yang kami mau. Websitenya rapi dan gampang diupdate sendiri.', 5, TRUE, 2),
  ('Guru TI SMK', 'Koordinator Sistem Informasi · 2025', 'Sistem informasi akademiknya sangat membantu proses input nilai dan jadwal. Support setelah launching juga responsif.', 5, TRUE, 3);

-- Awards / Achievements
INSERT INTO awards (title, organization, year, description, sort_order) VALUES
  ('Sertifikasi Web Development Fundamentals', 'Dicoding Indonesia', 2023, 'Sertifikasi dasar pengembangan web front-end dan back-end.', 1),
  ('Peserta Terbaik Bootcamp Full-Stack', 'Komunitas Developer Lokal', 2023, 'Menyelesaikan bootcamp full-stack dengan proyek akhir sistem informasi.', 2),
  ('Kontributor Proyek Open Source', 'GitHub', 2024, 'Berkontribusi pada beberapa proyek open source berbasis Vue/Nuxt.', 3),
  ('Freelancer Aktif', 'Studi Independen', 2022, 'Mulai berkarir sebagai web developer freelance sejak 2022.', 4);

-- Availability
INSERT INTO availability (month, year_month, status) VALUES
  ('Agustus 2026',   '2026-08-01', 'open'),
  ('September 2026', '2026-09-01', 'limited'),
  ('Oktober 2026',   '2026-10-01', 'open'),
  ('November 2026',  '2026-11-01', 'open'),
  ('Desember 2026',  '2026-12-01', 'limited');
