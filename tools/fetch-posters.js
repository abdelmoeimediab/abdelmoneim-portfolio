// Downloads a poster (the first-frame thumbnail Google Drive generates) for every Drive video in
// assets/js/content.js and saves it to assets/posters/<driveId>.jpg. Run after adding new videos:
//   node tools/fetch-posters.js
// Files that already exist are skipped. Requests go one at a time to avoid Drive's rate limit.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../assets/js/content.js'), 'utf8'), ctx);
const ids = ctx.window.SITE.projects.filter((p) => p.type === 'video' && p.drive).map((p) => p.drive);
const outDir = path.join(__dirname, '../assets/posters');
fs.mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  for (const id of ids) {
    const file = path.join(outDir, id + '.jpg');
    if (fs.existsSync(file)) { console.log('skip', id); continue; }
    let ok = false;
    for (let attempt = 1; attempt <= 4 && !ok; attempt++) {
      const res = await fetch('https://drive.google.com/thumbnail?id=' + id + '&sz=w720', { redirect: 'follow' });
      const type = res.headers.get('content-type') || '';
      if (res.ok && type.startsWith('image/')) {
        fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
        console.log('saved', id);
        ok = true;
      } else {
        console.log('retry', id, res.status);
        await sleep(3000 * attempt);
      }
    }
    if (!ok) console.log('FAILED', id, '(is the file shared as "Anyone with the link"?)');
    await sleep(600);
  }
})();
