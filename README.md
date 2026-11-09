# SuperMaru

Astro static blog for https://www.supermaru.com/. Markdown content, archived WordPress comments, local-only Keystatic admin, and GitHub Pages deployment.

## Develop and publish

Requires Node 22.23.4+ (Node 24 supported).

```sh
npm ci
npm run admin -- --host 127.0.0.1 --background
```

Open http://127.0.0.1:4321/keystatic. Keystatic only runs locally; the deployed build contains no admin/API routes. Keep the development server bound to loopback: this admin writes files without a login.

- Posts live in `src/content/posts/*.md`; About in `src/content/pages/about.md`.
- The editor is intentionally **Markdown source**, not WYSIWYG. A tested Markdoc save removed linked-image destinations and the image picker discarded legacy hero paths. Source editing preserves Markdown and raw HTML exactly. Keystatic may normalize YAML formatting and add `draft: false` when saving; field values are retained.
- Published timestamps are ISO 8601 text including seconds and an explicit Pacific offset (`-07:00` during daylight time, `-08:00` during standard time). Keystatic's datetime field cannot round-trip these timestamps safely.
- Keep imported `urlPath`, `wpId`, and hero paths unchanged. New posts leave legacy fields blank and get `/YYYY/MM/slug/` in America/Los_Angeles. Changing a published slug changes its derived URL.
- Categories use complete archive paths, e.g. `data-center/vmware/esxi`; tags use flat slugs. Parent archives include descendants. New terms automatically gain archive pages.
- Put new image files under `public/images/`; refer to `/images/filename` from Markdown or the hero image path field.
- Drafts appear in development but are excluded from the production homepage, routes, archives, sitemap, and RSS.
- Comments are read-only, stored in `src/data/comments.json`.

```sh
npm exec astro check
npm run build
npm run preview
# After reviewing the changes:
git add .
git commit -m "Publish post"
git push origin main
```

Manage servers with `npm exec astro dev stop`, `npm exec astro dev status`, `npm exec astro dev logs` (likewise `preview`). Stop development before starting preview on the same port.

## Reimport from WordPress

**Import overwrites imported Markdown and comment/taxonomy data. Do not rerun after editing/publishing unless replacing those edits is intentional.**

```sh
bash scripts/fetch-wp.sh
node scripts/import-wp.mjs
npm run build
bash scripts/check-urls.sh
node scripts/verify-build.mjs
python3 -c "import xml.etree.ElementTree as E; t=E.parse('dist/rss.xml'); assert len(t.findall('.//item')) == 50; print('RSS: 50 items')"
```

Both source scripts use `--resolve www.supermaru.com:443:208.109.28.20` because local DNS overrides this host. JSON, pagination headers, sitemap snapshots, and missing-media diagnostics stay in ignored `tmp/`. Downloads are resumable; upload paths and variants stay under `public/wp-content/uploads/` unchanged. HTTP and HTTPS upload references become root-relative.

### Source discrepancies requiring resolution before cutover

- WordPress's media header reports **139**, but 100-item descending, ascending, and 50-item pagination all return the same **138** unique public records. The fetch script deliberately fails its 139-record assertion and saves the partial export for diagnosis. All other counts match: 50 posts, 1 page, 17 categories, 92 tags, 12 comments. The other JSON files remain usable independently.
- Of **306** discovered upload URLs, **97** download successfully and **209** return 404 from the original host; **71** of these are images displayed by the generated pages. `tmp/wp/missing-media.json` lists all missing URLs. Restore the original uploads folder from a hosting/SFTP backup; do not replace missing pictures with fabricated images or delete the references. The strict image acceptance check remains failing until restored.
- Live sitemaps contain **152** URLs, not 160: 50 posts, 2 page entries (including home), 16 categories, 84 tags. The verifier also checks all 160 REST-inventory links: **161** distinct URLs including home, all generated. Unused taxonomy terms are kept in `src/data/taxonomies.json`.
- The source has 153 `<pre>` elements, two empty. All **151 nonempty** code blocks and all **6 iframes** survive conversion. Code remains unlabelled because WordPress supplies no language metadata; no guessed syntax languages are added.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` uses the official [Astro Pages recipe](https://docs.astro.build/en/guides/deploy/github/) with checkout v7, withastro/action v6, and deploy-pages v5. Production builds are static; React and Keystatic integrations are development-only. `public/CNAME` records `www.supermaru.com` for possible branch-based publishing, but Actions publishing uses the repository Pages setting.

1. Public repository: https://github.com/mackyruiz/supermaru-com, branch `main`.
2. Settings → Pages → Source is configured to GitHub Actions.
3. The [first workflow](https://github.com/mackyruiz/supermaru-com/actions/runs/42652018022) built and deployed successfully. The initial project URL `https://mackyruiz.github.io/supermaru-com/` served the homepage before custom-domain configuration. Production paths intentionally target the custom domain root, not the repository subpath.
4. Pages custom domain is configured to `www.supermaru.com`. Before DNS changes, requests pinned to GitHub's `185.199.108.153` over HTTP returned 200 for both `/2015/10/speedtest-cli-on-ubuntu/` and `/category/data-center/vmware/esxi/`. HTTPS is not yet enforced; provision and enable it after DNS propagation.
5. Optionally verify domain ownership with GitHub's `_github-pages-challenge-mackyruiz` TXT record.

## DNS cutover and rollback

Do not proceed until the Pages deployment is green and missing-source/media issues are resolved. Keep a cold WXR export and full uploads backup before cancelling hosting.

At GoDaddy, lower the existing apex A record TTL to 600 and wait out its old 10800-second TTL (3 hours). Then replace `A @ → 208.109.28.20` with:

- A: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- AAAA: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
- CNAME `www` → `mackyruiz.github.io` (no repository path)

Delete only the obsolete TXT `v=spf1 a mx ptr include:secureserver.net ~all`. Preserve **all** Proton records, including:

- MX `0 mail.protonmail.ch`
- TXT `v=spf1 include:_spf.protonmail.ch mx ~all`
- TXT `protonmail-verification=4c55cdf3c946174d97962403d597b12009b7eefb`

After propagation, enable Enforce HTTPS (certificate provisioning can take 24 hours). Check without `--resolve`: canonical post and nested category return 200; apex redirects 301 to `https://www.supermaru.com/`; `/rss.xml` parses; DNS has the new A/CNAME records; MX is unchanged. Send and receive a Proton Mail test message.

`/feed/` is an HTML navigation shim to `/rss.xml`, not an XML HTTP redirect; feed clients may need their subscription URL updated. Old home pagination `/page/2/`–`/page/5/` and `/wp-sitemap.xml` intentionally return 404. Submit `/sitemap-index.xml` to Search Console.

Keep WordPress hosting for **two consecutive days of successful live checks**. To roll back completely, remove GitHub A/AAAA records, restore `A @ → 208.109.28.20`, and restore `CNAME www → @`; changing only one A record would leave mixed/IPv6 traffic on GitHub. Keep the domain registration and Proton Mail regardless of hosting cancellation.
