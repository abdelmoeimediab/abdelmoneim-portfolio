# Abdelmoneim Diab | Visual & Motion Lab — Portfolio

Static portfolio site (Phase 1: front-end only, no admin or CMS), deployed on Vercel.

## Files
- `index.html`: page shell (header, intro, page-transition curtain, project viewer).
- `assets/js/content.js`: **all text, numbers, clients, categories, projects and experience**, in English and Arabic. Edit this file to change content.
- `assets/js/app.js`: router (`#/`, `#/work`, `#/work/<category>`, `#/experience`, `#/contact`), EN/AR switch, and motion (GSAP + ScrollTrigger + SplitText, Lenis smooth scroll synced through `gsap.ticker`).
- `assets/css/main.css`: design tokens and layout.
- `assets/work/`: image projects. `assets/posters/`: first-frame stills of the Google Drive videos.
- `build.js`: Vercel build. Copies the site to `dist/`, cache-busts CSS/JS, and writes `dist/assets/js/supabase-config.js` from the Supabase env vars (kept ready for Phase 2, not loaded by the page).
- `supabase-schema.sql`: Phase 2 database schema (public read, admin-only write).

## Adding content
- **Client logo**: put the file in `assets/logos/` and set `logo: 'assets/logos/<file>'` on the client in `content.js`.
- **Video from Google Drive**: share the file as "Anyone with the link", add a project with `type: 'video'` and `drive: '<file id>'`, then run `node tools/fetch-posters.js` to save its first-frame poster.
- **Image**: put it in `assets/work/` and add a project with `type: 'image'` and `src`.
- Each project has `role` and `decision` lines in both languages. `decision: null` shows "To be added".

## Local preview
```
node build.js
npx http-server dist -p 4173
```
