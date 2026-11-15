# supermaru.com

Portfolio and resume site built with Astro and deployed to GitHub Pages.

## Development

```bash
npm install
npm run dev
```

Dev server runs at http://localhost:4321

## Adding Posts

Create a new markdown file in `src/content/posts/`:

```markdown
---
title: "Post Title"
description: "Brief description"
date: 2025-01-15
tags: ["tag1", "tag2"]
featured: true
link: "https://live-demo.com"
github: "https://github.com/user/repo"
---

Full post body and details here.
```

Fields: `title`, `description`, `date` required; `tags`, `link`, `github`, `image`, `featured` (default `false`) optional. Featured posts (max 3, newest first) appear on the home page.

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via Actions.

## Stack

- Astro 7
- Hallmark console theme design system
- GitHub Pages hosting
