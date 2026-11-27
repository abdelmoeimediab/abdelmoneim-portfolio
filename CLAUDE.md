# CLAUDE.md — Abdelmoneim Diab portfolio

Read this first, then `docs/design-brief.md` (the owner's full design brief) and `docs/TOOLS-AND-SKILLS.md`.

## Who and what
- Owner: Abdelmoneim Ashraf Diab, graphic designer / motion designer. He writes Arabic (Egyptian dialect) and English; reply in the language he uses.
- Goal: rebuild the portfolio from scratch (Phase 1: static front-end only; Phase 2: admin/CMS later).
- Current state (2026-11-27): the old design and its admin dashboard were removed. The Phase 1 redesign (direction "the frame": stone background, teal `#00AA83` accent, a frame that morphs 9:16 → 4:5 → 16:9) lives in `index.html` + `assets/`. Content is in `assets/js/content.js`. It is a trial the owner will iterate on; numbers (12 clients, 4+ years) and logos are placeholders.

## Infrastructure (verified 2026-11-22)
- GitHub: `abdelmoeimediab/abdelmoneim-portfolio`, default branch `main`. Pushes to any branch get a Vercel preview; `main` is production.
- Vercel: project `abdelmoneim-portfolio` (`prj_BWpXtKe1fT3wp5YvgHQrKMFfFNP9`), team `team_KtFZhTm3dQ59hFyMXxhMPGqn`, Hobby plan, no custom domain. Preview deployments are behind Vercel SSO protection.
- Vercel env vars (all environments): `SUPABASE_URL`, `SUPABASE_ANON_KEY` (both public values).
- Build: `vercel.json` runs `node build.js`, which copies `index.html` and `assets/` to `dist/`, cache-busts local CSS/JS, and writes the two env vars to `dist/assets/js/supabase-config.js` (ready for Phase 2, not loaded by the page). If the file layout changes or a framework is added, update `build.js` and `vercel.json` together.
- Supabase: project ref `wcbluejcttbocervgwot` (eu-west-1). Schema in `supabase-schema.sql`: tables `portfolio_partners`, `portfolio_projects`, `portfolio_settings`, `portfolio_admins`. RLS: public read; writes only for users listed in `portfolio_admins` (checked by `is_portfolio_admin()`). One admin user exists. On 2026-11-22 the admin signed in through the old page, which seeded 23 projects, 6 partners and 2 settings rows (this proved admin write works). The new front-end does not read these tables.
- Public sign-ups are already disabled (verified 2026-11-27). Optional: enable leaked-password protection.
- Videos: posters are first-frame stills saved locally by `node tools/fetch-posters.js` (Drive thumbnails rate-limit with HTTP 429 when many load at once); playback uses Drive's `/preview` embed.

## First task in every new setup: audit the Vercel <-> Supabase link
Do this before designing anything. Report results; do not change anything destructive.
1. Vercel: project settings, env vars present for production/preview/development, latest production deployment READY, build log shows "Wrote Supabase config from environment variables".
2. Supabase: tables exist with RLS on, policies match `supabase-schema.sql`, run the security advisor, confirm `portfolio_admins` has a row.
3. End to end: open the production URL and confirm no console errors; with the anon key, confirm REST read works and anon write is refused (the Phase 1 page itself does not call Supabase).
4. Check the repo: no secrets committed (only the anon key may appear, and only in build output), `.gitignore` covers `dist/`.
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
