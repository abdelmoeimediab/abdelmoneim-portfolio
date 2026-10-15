# Abdelmoneim Ashraf Diab — Portfolio & CMS

The portfolio is a static site built and deployed from GitHub through Vercel. The Vercel build creates `dist/index.html` and injects the public Supabase project URL and publishable key from environment variables.

## Vercel environment variables

Set both for Production, Preview, and Development:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` (publishable/anon only; never use a secret or service-role key)

## Supabase

The `supabase-schema.sql` file creates the tables, enables RLS, permits public reads, and restricts writes to the owner's Supabase Auth email. It can be run repeatedly and removes the legacy browser password from existing settings without deleting portfolio rows.

Create the owner account in Supabase Auth for `abdelmoneimashrafdiab@gmail.com`. The CMS login at `#admin` uses Supabase Auth; it has no built-in password. Cloud saves require that signed-in owner account. Local browser data is kept and only local-only records are added to the cloud snapshot when the owner saves.
