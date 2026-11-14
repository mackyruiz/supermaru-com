import { categories, tags } from '../data/taxonomies.json';

const categoryNames = new Map(categories.map((term) => [term.path, term.name]));
const tagNames = new Map(tags.map((term) => [term.path, term.name]));

export function categoryName(path: string): string {
  const name = categoryNames.get(path);
  if (name) return name;
  return path.split('/').at(-1)!.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function tagName(path: string): string {
  return tagNames.get(path) ?? path;
}

export function categoryTrail(path: string): { href: string; name: string }[] {
  const parts = path.split('/');
  return parts.slice(0, -1).map((_, index) => {
    const prefix = parts.slice(0, index + 1).join('/');
    return { href: `/category/${prefix}/`, name: categoryName(prefix) };
  });
}

export function primaryCategory(categories: string[]): string | undefined {
  return categories.find((term) => !term.includes('/')) ?? categories[0];
}
