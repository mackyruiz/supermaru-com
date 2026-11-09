import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import domino from '@mixmark-io/domino';

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}
const files = await walk('dist');
const postFiles = files.filter(file => /^dist\/\d{4}\/\d{2}\/[^/]+\/index\.html$/.test(file));
assert.equal(postFiles.length, 50, 'Expected 50 published posts');
console.log(`Published posts: ${postFiles.length}`);
const comments = JSON.parse(await fs.readFile('src/data/comments.json', 'utf8'));
let commentedPosts = 0;
const missingImages = new Set();
for (const file of files.filter(file => file.endsWith('.html'))) {
  const html = await fs.readFile(file, 'utf8');
  const doc = domino.createDocument(html);
  for (const image of doc.querySelectorAll('img[src]')) {
    const src = image.getAttribute('src');
    if (!src.startsWith('/wp-content/uploads/')) continue;
    try { await fs.access(path.join('dist', decodeURIComponent(src))); }
    catch { missingImages.add(src); }
  }
  if (postFiles.includes(file)) {
    const slug = file.split('/').at(-2);
    const list = comments[slug] ?? [];
    if (list.length) {
      commentedPosts++;
      assert(html.includes(`Comments (${list.length})`), `Comment count missing: ${file}`);
      assert(html.includes('Comments are closed.'), `Archive notice missing: ${file}`);
      for (const comment of list) assert(doc.body.textContent.includes(comment.author), `Author missing in ${file}`);
    } else assert(!html.includes('Comments ('), `Unexpected comment section: ${file}`);
  }
}
assert.equal(commentedPosts, Object.keys(comments).length);
assert.equal(Object.values(comments).flat().length, 12);
console.log(`Archived comments: 12 across ${commentedPosts} posts`);
const wp458 = (await Promise.all((await fs.readdir('src/content/posts')).map(async name => ({ name, body: await fs.readFile(`src/content/posts/${name}`, 'utf8') })))).find(entry => /^wpId: 458$/m.test(entry.body));
assert(wp458, 'WP post 458 is missing');
const wp458file = postFiles.find(file => file.split('/').at(-2) === wp458.name.slice(0, -3));
assert((await fs.readFile(wp458file, 'utf8')).includes('Volker'), 'Volker comment is missing');
for (const route of ['2015/10/speedtest-cli-on-ubuntu', '2016/10/script-monitor-disk-space-usage']) {
  const html = await fs.readFile(`dist/${route}/index.html`, 'utf8');
  assert(html.includes('<pre'), `Code blocks missing: ${route}`);
  assert(html.includes(route.split('/').at(-1) === 'speedtest-cli-on-ubuntu' ? 'speedtest-cli' : 'df'), `Code text missing: ${route}`);
}
console.log('Both legacy code-block scenarios pass');
assert(!files.some(file => file.startsWith('dist/keystatic/') || file.startsWith('dist/api/keystatic/')), 'Admin routes must never be deployed');
for (const src of [...missingImages].sort()) console.error(`Missing image: ${src}`);
console.log(`Missing displayed upload images: ${missingImages.size}`);
assert.equal(missingImages.size, 0, 'Restore missing uploads from the hosting backup before cutover');
