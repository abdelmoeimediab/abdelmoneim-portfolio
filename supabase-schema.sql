-- Supabase schema for the Abdelmoneim Diab portfolio CMS.
-- Public read; writes only for admins listed in portfolio_admins.

-- Start clean (destructive: removes all portfolio data).
drop table if exists public.abdelmoneimportfolio, public.portfolio_partners, public.portfolio_projects,
  public.portfolio_settings, public.portfolio_admins cascade;
drop function if exists public.is_portfolio_admin();
drop function if exists public.set_updated_at();

create table public.portfolio_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.portfolio_admins enable row level security;
create policy "admins can read own row" on public.portfolio_admins
  for select to authenticated using (user_id = (select auth.uid()));

create function public.is_portfolio_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())) $$;
revoke all on function public.is_portfolio_admin() from public, anon;
grant execute on function public.is_portfolio_admin() to authenticated;

create function public.set_updated_at() returns trigger
language plpgsql set search_path = ''
as $$ begin new.updated_at = now(); return new; end $$;

create table public.portfolio_partners (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
create table public.portfolio_projects (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
create table public.portfolio_settings (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['portfolio_partners', 'portfolio_projects', 'portfolio_settings'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    execute format('create policy "admin insert" on public.%I for insert to authenticated with check ((select public.is_portfolio_admin()))', t);
    execute format('create policy "admin update" on public.%I for update to authenticated using ((select public.is_portfolio_admin())) with check ((select public.is_portfolio_admin()))', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using ((select public.is_portfolio_admin()))', t);
  end loop;
end $$;
