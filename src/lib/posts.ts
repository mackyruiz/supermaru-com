import { getCollection, type CollectionEntry } from 'astro:content';

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit',
});
export function postPath(entry: CollectionEntry<'posts'>): string {
  if (entry.data.urlPath) return entry.data.urlPath;
  const parts = monthFormatter.formatToParts(entry.data.pubDate);
  const year = parts.find((part) => part.type === 'year')!.value;
  const month = parts.find((part) => part.type === 'month')!.value;
  return `${year}/${month}/${entry.id}`;
}
export async function allPosts() {
  return (await getCollection('posts', ({ data }) => import.meta.env.PROD ? !data.draft : true))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
export const formatDate = (date: Date) => new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', year: 'numeric',
}).format(date);
