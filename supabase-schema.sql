-- Supabase SQL Schema for Abdelmoneim Diab | Visual & Motion Lab
CREATE TABLE IF NOT EXISTS portfolio_partners (
  id TEXT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  short_name TEXT NOT NULL,
  badge TEXT,
  sector_ar TEXT,
  sector_en TEXT,
  role_ar TEXT,
  role_en TEXT,
  overview_ar TEXT,
  overview_en TEXT,
  challenge_ar TEXT,
  challenge_en TEXT,
  metrics JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id TEXT PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  category TEXT NOT NULL,
  partner_id TEXT REFERENCES portfolio_partners(id) ON DELETE CASCADE,
  drive_id TEXT,
  file_name TEXT,
  file_size TEXT,
  aspect TEXT DEFAULT '9:16',
  desc_ar TEXT,
  desc_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
