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

CREATE POLICY "Public Read Partners" ON portfolio_partners FOR SELECT USING (true);
CREATE POLICY "Public Write Partners" ON portfolio_partners FOR ALL USING (true);
CREATE POLICY "Public Read Projects" ON portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Public Write Projects" ON portfolio_projects FOR ALL USING (true);
CREATE POLICY "Public Read Settings" ON portfolio_settings FOR SELECT USING (true);
CREATE POLICY "Public Write Settings" ON portfolio_settings FOR ALL USING (true);
