// Build step for Vercel: copies the static site (index.html + assets/) to dist/.
// Phase 1 front-end does not talk to Supabase. To keep Phase 2 ready, when the Vercel project has
// SUPABASE_URL and SUPABASE_ANON_KEY set, they are written to dist/assets/js/supabase-config.js
// (not loaded by the page yet). The anon key is public by design; access is enforced by RLS.
const fs = require('fs');
const path = require('path');

const OUT = 'dist';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
// Cache-bust local CSS/JS so a new deployment is never served stale files.
const v = Date.now().toString(36);
const html = fs.readFileSync('index.html', 'utf8').replace(/(assets\/(?:css|js)\/[\w.-]+\.(?:css|js))"/g, '$1?v=' + v + '"');
fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.cpSync('assets', path.join(OUT, 'assets'), { recursive: true });

const url = (process.env.SUPABASE_URL || '').trim();
const key = (process.env.SUPABASE_ANON_KEY || '').trim();
if (url || key) {
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) || key.length < 20) {
    console.error('SUPABASE_URL / SUPABASE_ANON_KEY look invalid; refusing to build.');
    process.exit(1);
  }
  fs.writeFileSync(
    path.join(OUT, 'assets/js/supabase-config.js'),
    'window.SUPABASE_CONFIG = ' + JSON.stringify({ url, anonKey: key }) + ';\n'
  );
  console.log('Wrote Supabase config from environment variables (unused until Phase 2).');
} else {
  console.log('No Supabase env vars set; skipping Supabase config.');
}
console.log('Built static site into dist/.');
