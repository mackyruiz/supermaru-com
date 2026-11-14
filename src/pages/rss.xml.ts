import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { allPosts, postPath } from '../lib/posts';
import { SITE_DESCRIPTION } from '../lib/site';
export async function GET(context: APIContext) {
  return rss({ title: 'SuperMaru', description: SITE_DESCRIPTION, site: context.site!,
    items: (await allPosts()).map(post => ({ title: post.data.title, pubDate: post.data.pubDate, description: post.data.description, link: `/${postPath(post)}/` })),
  });
}
