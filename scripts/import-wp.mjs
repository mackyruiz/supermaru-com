import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import domino from '@mixmark-io/domino';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const load = async (name) => JSON.parse(await fs.readFile(`tmp/wp/${name}.json`, 'utf8'));
const [posts, pages, categories, tags, media, comments] = await Promise.all(
  ['posts', 'pages', 'categories', 'tags', 'media', 'comments'].map(load),
);
const document = (html) => domino.createDocument(html);
const text = (html) => document(html).body.textContent.replace(/\s+/g, ' ').trim();
// Older WordPress entries also contain HTTP upload URLs. Normalize both protocols.
const localUploads = (html) => html.replace(/https?:\/\/www\.supermaru\.com(?=\/wp-content\/uploads\/)/g, '');
const service = new TurndownService({
  headingStyle: 'atx', codeBlockStyle: 'fenced', fence: '```',
  bulletListMarker: '-', emDelimiter: '_', strongDelimiter: '**',
});
service.use(gfm);
service.keep(['iframe']);
service.addRule('emptyParagraph', {
  filter: (node) => node.nodeName === 'P' && !node.textContent.replace(/\u00a0/g, '').trim() && !node.querySelector('img,iframe'),
  replacement: () => '',
});
service.addRule('barePre', {
  filter: (node) => node.nodeName === 'PRE' && !node.querySelector('code'),
  replacement: (_, node) => {
    const code = node.textContent.replace(/\n$/, '');
    const runs = code.match(/`{3,}/g) ?? [];
    const fence = '`'.repeat(Math.max(3, ...runs.map((run) => run.length + 1)));
    return `\n\n${fence}\n${code}\n${fence}\n\n`;
  },
});
service.addRule('captionedFigure', {
  filter: (node) => node.nodeName === 'FIGURE' && !!node.querySelector('figcaption') && !!node.querySelector('img'),
  replacement: (_, node) => {
    const image = node.querySelector('img');
    const alt = (image.getAttribute('alt') ?? '').replace(/[\[\]]/g, '\\$&');
    const src = image.getAttribute('src').replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29');
    const caption = service.turndown(node.querySelector('figcaption').innerHTML);
    return `\n\n![${alt}](${src})\n\n_${caption}_\n\n`;
  },
});
// Highest precedence: do not duplicate the featured image as body content.
service.addRule('featuredImage', {
  filter: (node) => node.nodeName === 'FIGURE' && node.classList.contains('wp-block-post-featured-image'),
  replacement: () => '',
});
function convert(html) {
  const doc = document(localUploads(html));
  for (const node of doc.querySelectorAll('[srcset], [sizes]')) {
    node.removeAttribute('srcset'); node.removeAttribute('sizes');
  }
  return service.turndown(doc.body.innerHTML) + '\n';
}
function description(html) {
  const doc = document(html);
  for (const node of doc.querySelectorAll('.read-more')) node.remove();
  const value = text(doc.body.innerHTML).replace(/\s*\[(?:…|\.{3})\]\s*$/, '').trim();
  if (value.length <= 160) return value;
  return value.slice(0, 161).replace(/\s+\S*$/, '').trim();
}
function published(post) {
  // The local REST date is authoritative; some legacy GMT fields disagree.
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', timeZoneName: 'longOffset',
  });
  let result = `${post.date}-08:00`;
  for (let i = 0; i < 2; i++) {
    const offset = formatter.formatToParts(new Date(result)).find((part) => part.type === 'timeZoneName').value.replace('GMT', '');
    result = `${post.date}${offset}`;
  }
  return result;
}
const termMap = (terms, prefix) => new Map(terms.map((term) => [term.id, new URL(term.link).pathname.slice(prefix.length).replace(/\/$/, '')]));
const categoryMap = termMap(categories, '/category/');
const tagMap = termMap(tags, '/tag/');
const mediaMap = new Map(media.map((item) => [item.id, item]));
const frontmatter = (data) => '---\n' + Object.entries(data)
  .filter(([, value]) => value !== undefined && value !== '' && (!Array.isArray(value) || value.length))
  .map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n') + '\n---\n\n';
for (const dir of ['src/content/posts', 'src/content/pages', 'src/data']) await fs.mkdir(dir, { recursive: true });
for (const post of posts) {
  const hero = mediaMap.get(post.featured_media);
  if (post.featured_media && !hero) throw Error(`Missing featured media ${post.featured_media} for ${post.slug}`);
  const data = {
    title: text(post.title.rendered), pubDate: published(post), description: description(post.excerpt.rendered),
    categories: post.categories.map((id) => categoryMap.get(id)), tags: post.tags.map((id) => tagMap.get(id)),
    heroImage: hero ? new URL(hero.source_url).pathname : undefined,
    urlPath: new URL(post.link).pathname.replace(/^\/|\/$/g, ''), wpId: post.id,
  };
  await fs.writeFile(`src/content/posts/${post.slug}.md`, frontmatter(data) + convert(post.content.rendered));
}
for (const page of pages) await fs.writeFile(`src/content/pages/${page.slug}.md`, frontmatter({ title: text(page.title.rendered) }) + convert(page.content.rendered));
const slugById = new Map(posts.map((post) => [post.id, post.slug]));
const archived = {};
for (const comment of comments.sort((a, b) => a.date.localeCompare(b.date))) {
  const slug = slugById.get(comment.post);
  if (!slug) throw Error(`Comment references missing post ${comment.post}`);
  (archived[slug] ??= []).push({ author: text(comment.author_name), date: comment.date, html: localUploads(comment.content.rendered) });
}
await fs.writeFile('src/data/comments.json', JSON.stringify(archived, null, 2) + '\n');
// Keep all archive terms, including parents without directly assigned posts.
await fs.writeFile('src/data/taxonomies.json', JSON.stringify({
  categories: categories.map((term) => ({ path: categoryMap.get(term.id), name: text(term.name) })),
  tags: tags.map((term) => ({ path: tagMap.get(term.id), name: text(term.name) })),
}, null, 2) + '\n');
const uploads = new Set();
function collect(value) {
  const url = new URL(value, 'https://www.supermaru.com');
  if (url.hostname === 'www.supermaru.com' && url.pathname.startsWith('/wp-content/uploads/')) {
    url.protocol = 'https:'; url.hash = ''; url.search = ''; uploads.add(url.href);
  }
}
for (const item of media) collect(item.source_url);
for (const item of [...posts, ...pages]) {
  for (const node of document(item.content.rendered).querySelectorAll('[src], [href], [srcset]')) {
    for (const attr of ['src', 'href']) if (node.hasAttribute(attr)) collect(node.getAttribute(attr));
    if (node.hasAttribute('srcset')) for (const candidate of node.getAttribute('srcset').split(',')) collect(candidate.trim().split(/\s+/)[0]);
  }
}
const missing = [];
let downloaded = 0;
for (const url of uploads) {
  const dest = path.join('public', decodeURIComponent(new URL(url).pathname));
  try { await fs.access(dest); continue; } catch {}
  await fs.mkdir(path.dirname(dest), { recursive: true });
  const result = spawnSync('curl', ['--silent', '--show-error', '--resolve', 'www.supermaru.com:443:208.109.28.20', '--output', `${dest}.part`, '--write-out', '%{http_code}', url], { encoding: 'utf8' });
  if (result.status === 0 && result.stdout === '200') {
    await fs.rename(`${dest}.part`, dest); downloaded++;
  } else {
    await fs.rm(`${dest}.part`, { force: true });
    if (result.stdout !== '404') throw Error(`Download failed ${url}: ${result.stdout} ${result.stderr}`);
    console.error(`404: ${url}`); missing.push(url);
  }
}
await fs.writeFile('tmp/wp/missing-media.json', JSON.stringify(missing, null, 2) + '\n');
console.log(JSON.stringify({ posts: posts.length, pages: pages.length, comments: comments.length, commentedPosts: Object.keys(archived).length, mediaRecords: media.length, uploadURLs: uploads.size, downloaded, missing: missing.length }, null, 2));
