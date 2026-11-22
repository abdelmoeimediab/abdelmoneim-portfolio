// Build step for Vercel: copies index.html to dist/ and, when the Vercel project
// has SUPABASE_URL and SUPABASE_ANON_KEY set, injects them as the site's Supabase
// connection. Without them, the defaults already written in index.html are used.
// (The anon key is a public key by design; access is enforced by RLS policies.)
const fs = require('fs');

const url = (process.env.SUPABASE_URL || '').trim();
const key = (process.env.SUPABASE_ANON_KEY || '').trim();

let html = fs.readFileSync('index.html', 'utf8');

if (url || key) {
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) || key.length < 20) {
    console.error('SUPABASE_URL / SUPABASE_ANON_KEY look invalid; refusing to build.');
    process.exit(1);
  }
  const before = html;
  html = html
    .replace(/const DEFAULT_SUPABASE_URL = '[^']*';/, () => `const DEFAULT_SUPABASE_URL = '${url}';`)
    .replace(/const DEFAULT_SUPABASE_KEY = '[^']*';/, () => `const DEFAULT_SUPABASE_KEY = '${key}';`);
  if (html === before) {
    console.error('Could not find the Supabase constants in index.html.');
    process.exit(1);
  }
  console.log('Injected Supabase connection from environment variables.');
} else {
  console.log('No Supabase env vars set; using defaults from index.html.');
}

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', html);
