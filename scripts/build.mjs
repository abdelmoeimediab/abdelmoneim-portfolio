import { mkdir, readFile, writeFile } from 'node:fs/promises';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error('Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in Vercel.');
if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)) throw new Error('Invalid SUPABASE_URL.');
if (key.startsWith('sb_secret_') || key.includes('service_role')) throw new Error('Never expose a Supabase secret/service-role key in this public site.');

const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const output = source
  .replaceAll('__SUPABASE_URL__', JSON.stringify(url.replace(/\/$/, '')).slice(1, -1))
  .replaceAll('__SUPABASE_PUBLISHABLE_KEY__', JSON.stringify(key).slice(1, -1));
if (output.includes('__SUPABASE_')) throw new Error('Supabase build configuration was not fully injected.');
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/index.html', import.meta.url), output);
console.log('Portfolio build complete.');
