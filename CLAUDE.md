# CLAUDE.md — Abdelmoneim Diab portfolio

Read this first, then `docs/design-brief.md` (the owner's full design brief) and `docs/TOOLS-AND-SKILLS.md`.

## Who and what
- Owner: Abdelmoneim Ashraf Diab, graphic designer / motion designer. He writes Arabic (Egyptian dialect) and English; reply in the language he uses.
- Goal: rebuild the portfolio from scratch (Phase 1: static front-end only; Phase 2: admin/CMS later).
- Current state: one `index.html` (old design, with an admin dashboard) deployed on Vercel. The redesign replaces it.

## Infrastructure (verified 2026-11-22)
- GitHub: `abdelmoeimediab/abdelmoneim-portfolio`, default branch `main`. Pushes to any branch get a Vercel preview; `main` is production.
- Vercel: project `abdelmoneim-portfolio` (`prj_BWpXtKe1fT3wp5YvgHQrKMFfFNP9`), team `team_KtFZhTm3dQ59hFyMXxhMPGqn`, Hobby plan, no custom domain. Preview deployments are behind Vercel SSO protection.
- Vercel env vars (all environments): `SUPABASE_URL`, `SUPABASE_ANON_KEY` (both public values).
- Build: `vercel.json` runs `node build.js`, which copies `index.html` to `dist/` and injects the two env vars into the `DEFAULT_SUPABASE_URL` / `DEFAULT_SUPABASE_KEY` constants. If the redesign moves to another file layout or a framework, update `build.js` and `vercel.json` together.
- Supabase: project ref `wcbluejcttbocervgwot` (eu-west-1). Schema in `supabase-schema.sql`: tables `portfolio_partners`, `portfolio_projects`, `portfolio_settings`, `portfolio_admins`. RLS: public read; writes only for users listed in `portfolio_admins` (checked by `is_portfolio_admin()`). One admin user exists. The data tables were wiped on 2026-11-22 at the owner's request and are empty until the admin signs in (the old page re-seeds from defaults).
- Still to do by the owner in the Supabase dashboard: turn off public sign-ups.

## First task in every new setup: audit the Vercel <-> Supabase link
Do this before designing anything. Report results; do not change anything destructive.
1. Vercel: project settings, env vars present for production/preview/development, latest production deployment READY, build log shows the env injection message.
2. Supabase: tables exist with RLS on, policies match `supabase-schema.sql`, run the security advisor, confirm `portfolio_admins` has a row.
3. End to end: open the production URL, confirm no console errors and that the page reads from Supabase (anon read works, anon write is refused).
4. Check the repo matches: `index.html` constants vs env vars, no secrets committed, `.gitignore` covers `dist/`.
5. Report any drift, then wait for the owner before continuing.

## Rules for working here
- Work on a branch and open a PR; never push straight to `main` unless asked.
- Never print or commit secrets. The Supabase anon key is public by design; the service-role key must never appear anywhere.
- Ask before any destructive database or Vercel action (drop, delete, reset, env var removal).
- Look at what you build: run it locally and screenshot it (Playwright MCP) at 375, 768 and 1440 px before saying it is done.
- Phase 1 has no admin panel, login, or CMS. Keep Supabase wired and ready but unused by the front-end until Phase 2.
- The design brief's non-negotiables win over any default taste: 100% flat, no black background, no neon/glass/gradient text, no boxes around headlines, strict EN/AR separation (Alexandria for Arabic, brand names in `<bdi dir="ltr">`), Lenis + GSAP ScrollTrigger synced through `gsap.ticker`, animations must never get stuck invisible (CSS fallback).
- First design step is to propose 2–3 directions and wait for the owner to choose.

## Open questions for the owner (unanswered when this file was written)
1. Contact details differ between the brief and the old site (email and phone). Which are correct? The brief also mentions `...-pink.vercel.app`, but the current Vercel domain is `abdelmoneim-portfolio-theta.vercel.app`.
2. Project count and years of experience to show on the home screen.
3. `rasas-portfolio-guide-ar.pdf` has not been provided yet.
4. Where do project images/videos live (Behance, Google Drive, local), who writes each case-study line (client, role, visual decision), and how is NDA work shown?
5. Should the brand teal `#00AA83` be the accent colour, or should the directions propose their own palette?
