-- ====================================================
-- LEMILLION — Schema untuk Neon PostgreSQL
-- Jalankan file ini PERTAMA lewat: psql "$DATABASE_URL" -f neon/01_schema.sql
-- (atau paste isinya ke Neon Console > SQL Editor)
-- ====================================================

-- gen_random_uuid() sudah built-in di PostgreSQL 13+ (versi default Neon).
-- Baris di bawah cuma jaga-jaga kalau service kamu masih di PG < 13.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- profile (single row — data diri Miftah)
CREATE TABLE IF NOT EXISTS profile (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name                  TEXT NOT NULL DEFAULT 'Miftah Pauzan Jamil',
  tagline               TEXT NOT NULL DEFAULT 'Web Developer',
  bio                   TEXT NOT NULL DEFAULT '',
  bio_extended          TEXT NOT NULL DEFAULT '',
  avatar_url            TEXT, hero_image_url TEXT, signature_url TEXT,
  location              TEXT NOT NULL DEFAULT 'Tasikmalaya, Indonesia',
  email                 TEXT NOT NULL DEFAULT 'miftahpauzanjamil@gmail.com',
  whatsapp              TEXT, github TEXT, linkedin TEXT, website TEXT,
  years_experience      INTEGER NOT NULL DEFAULT 4,
  projects_count        INTEGER NOT NULL DEFAULT 20,
  certifications_count  INTEGER NOT NULL DEFAULT 4,
  clients_count         INTEGER NOT NULL DEFAULT 15
);
CREATE UNIQUE INDEX IF NOT EXISTS profile_singleton ON profile ((true));

-- categories (harus ada sebelum portfolio karena ada FK)
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 99,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

-- portfolio (proyek-proyek web)
CREATE TABLE IF NOT EXISTS portfolio (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE,
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  description   TEXT NOT NULL DEFAULT '',
  story         TEXT,
  cover_url     TEXT NOT NULL DEFAULT '',
  image_url     TEXT NOT NULL DEFAULT '',
  gallery_urls  TEXT[] DEFAULT '{}',
  tags          TEXT[] DEFAULT '{}',
  year          INTEGER NOT NULL DEFAULT 2024,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    INTEGER NOT NULL DEFAULT 99,
  client        TEXT,
  location      TEXT,
  role          TEXT,      -- ex: "Full-stack Developer", "Frontend Developer"
  tech_stack    TEXT,       -- ex: "Nuxt 3, Tailwind, PostgreSQL"
  repo_url      TEXT,       -- link GitHub
  demo_url      TEXT        -- link live demo
);
CREATE INDEX IF NOT EXISTS idx_portfolio_category  ON portfolio(category_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured  ON portfolio(is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_published ON portfolio(is_published);

-- services (jasa yang ditawarkan)
CREATE TABLE IF NOT EXISTS services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title       TEXT NOT NULL, icon TEXT NOT NULL DEFAULT '💻',
  description TEXT NOT NULL DEFAULT '', price_min INTEGER NOT NULL DEFAULT 0,
  price_label TEXT NOT NULL DEFAULT 'Mulai dari', duration TEXT,
  features    TEXT[] DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 99, cta_label TEXT NOT NULL DEFAULT 'Hubungi Saya'
);

-- testimonials (kata klien)
CREATE TABLE IF NOT EXISTS testimonials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  client_name   TEXT NOT NULL, client_role TEXT NOT NULL, client_avatar TEXT,
  quote         TEXT NOT NULL, rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    INTEGER NOT NULL DEFAULT 99
);

-- awards (pencapaian / sertifikasi)
CREATE TABLE IF NOT EXISTS awards (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title         TEXT NOT NULL, organization TEXT NOT NULL,
  year          INTEGER NOT NULL, description TEXT, sort_order INTEGER NOT NULL DEFAULT 99
);

-- inquiries (pesan masuk dari form contact)
CREATE TABLE IF NOT EXISTS inquiries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name            TEXT NOT NULL, email TEXT NOT NULL, phone TEXT,
  session_type    TEXT, preferred_date DATE, budget_range TEXT, location_pref TEXT,
  message         TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied','closed','spam')),
  notes           TEXT, replied_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_date   ON inquiries(created_at DESC);

-- availability (slot ketersediaan proyek per bulan)
CREATE TABLE IF NOT EXISTS availability (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month       TEXT NOT NULL, year_month DATE NOT NULL UNIQUE,
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','limited','full')),
  notes       TEXT
);

-- auto updated_at trigger
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profile_updated ON profile;
CREATE TRIGGER trg_profile_updated   BEFORE UPDATE ON profile   FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS trg_portfolio_updated ON portfolio;
CREATE TRIGGER trg_portfolio_updated BEFORE UPDATE ON portfolio FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS trg_services_updated ON services;
CREATE TRIGGER trg_services_updated  BEFORE UPDATE ON services  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
