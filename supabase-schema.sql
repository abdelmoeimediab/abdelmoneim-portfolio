-- Supabase Schema for Abdelmoneim Diab Portfolio CMS
-- انسخ هذا الكود وضعه في Supabase -> SQL Editor -> Run

CREATE TABLE IF NOT EXISTS portfolio_partners (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_settings (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portfolio_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public All Partners" ON portfolio_partners;
DROP POLICY IF EXISTS "Public All Projects" ON portfolio_projects;
DROP POLICY IF EXISTS "Public All Settings" ON portfolio_settings;

CREATE POLICY "Public All Partners" ON portfolio_partners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Projects" ON portfolio_projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Settings" ON portfolio_settings FOR ALL USING (true) WITH CHECK (true);
