-- Secure the existing portfolio tables without removing any rows.
CREATE TABLE IF NOT EXISTS public.portfolio_partners (
  id TEXT PRIMARY KEY, payload JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id TEXT PRIMARY KEY, payload JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
  id TEXT PRIMARY KEY, payload JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.portfolio_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public All Partners" ON public.portfolio_partners;
DROP POLICY IF EXISTS "Public All Projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Public All Settings" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Public Read Partners" ON public.portfolio_partners;
DROP POLICY IF EXISTS "Public Write Partners" ON public.portfolio_partners;
DROP POLICY IF EXISTS "Public Read Projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Public Write Projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Public Read Settings" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Public Write Settings" ON public.portfolio_settings;
DROP POLICY IF EXISTS "portfolio partners public read" ON public.portfolio_partners;
DROP POLICY IF EXISTS "portfolio partners owner write" ON public.portfolio_partners;
DROP POLICY IF EXISTS "portfolio projects public read" ON public.portfolio_projects;
DROP POLICY IF EXISTS "portfolio projects owner write" ON public.portfolio_projects;
DROP POLICY IF EXISTS "portfolio settings public read" ON public.portfolio_settings;
DROP POLICY IF EXISTS "portfolio settings owner write" ON public.portfolio_settings;

CREATE POLICY "portfolio partners public read" ON public.portfolio_partners FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "portfolio partners owner write" ON public.portfolio_partners FOR ALL TO authenticated
  USING ((SELECT auth.jwt() ->> 'email') = 'abdelmoneimashrafdiab@gmail.com')
  WITH CHECK ((SELECT auth.jwt() ->> 'email') = 'abdelmoneimashrafdiab@gmail.com');
CREATE POLICY "portfolio projects public read" ON public.portfolio_projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "portfolio projects owner write" ON public.portfolio_projects FOR ALL TO authenticated
  USING ((SELECT auth.jwt() ->> 'email') = 'abdelmoneimashrafdiab@gmail.com')
  WITH CHECK ((SELECT auth.jwt() ->> 'email') = 'abdelmoneimashrafdiab@gmail.com');
CREATE POLICY "portfolio settings public read" ON public.portfolio_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "portfolio settings owner write" ON public.portfolio_settings FOR ALL TO authenticated
  USING ((SELECT auth.jwt() ->> 'email') = 'abdelmoneimashrafdiab@gmail.com')
  WITH CHECK ((SELECT auth.jwt() ->> 'email') = 'abdelmoneimashrafdiab@gmail.com');

UPDATE public.portfolio_settings SET payload = payload - 'adminPass' - 'adminUser', updated_at = NOW()
WHERE payload ? 'adminPass' OR payload ? 'adminUser';
GRANT SELECT ON public.portfolio_partners, public.portfolio_projects, public.portfolio_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.portfolio_partners, public.portfolio_projects, public.portfolio_settings TO authenticated;
REVOKE ALL ON public.portfolio_partners, public.portfolio_projects, public.portfolio_settings FROM PUBLIC;