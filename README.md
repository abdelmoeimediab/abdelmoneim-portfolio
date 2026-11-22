# Abdelmoneim Ashraf Diab — Portfolio & Supabase CMS

Static site (single `index.html`) deployed on Vercel, with content stored in Supabase.

## How it is wired
- `build.js` runs on Vercel, copies `index.html` to `dist/`, and injects `SUPABASE_URL` and `SUPABASE_ANON_KEY` from the Vercel project's environment variables (falls back to the defaults in `index.html`).
- Database schema and security policies live in `supabase-schema.sql`.
- Anyone can read the portfolio data. Only signed-in admins (rows in `portfolio_admins`) can write or delete.

## Admin dashboard
Open `#admin` or click the top-left AD logo 4 times, then sign in with the admin email and password (Supabase Auth).

## Adding an admin
1. Supabase → Authentication → Users → Add user (email + password).
2. In the SQL editor: `insert into public.portfolio_admins (user_id) select id from auth.users where email = 'you@example.com';`
3. Turn off public sign-ups in Authentication settings.
