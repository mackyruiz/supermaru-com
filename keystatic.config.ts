import { config, fields, collection, singleton } from '@keystatic/core';

// Keystatic's rich editor drops linked-image destinations and raw HTML.
// Store the original Markdown bytes instead, using its standard textarea UI.
function markdownSource() {
  const input = fields.text({
    label: 'Markdown',
    multiline: true,
    description: 'Plain Markdown and HTML. Add images under public/images and reference /images/filename.',
  });
  const decode = (_: unknown, { content }: { content: Uint8Array | undefined }) =>
    new TextDecoder().decode(content);
  return {
    kind: 'form' as const,
    formKind: 'content' as const,
    contentExtension: '.md',
    Input: input.Input,
    defaultValue: () => '',
    parse: decode,
    validate: (value: string) => input.validate(value, undefined),
    serialize: (value: string) => ({
      value: undefined,
      content: new TextEncoder().encode(value),
      other: new Map<string, Uint8Array>(),
      external: new Map<string, ReadonlyMap<string, Uint8Array>>(),
    }),
    reader: { parse: decode },
  };
}

export default config({
  storage: { kind: 'local' },
  ui: { brand: { name: 'SuperMaru' } },
  collections: {
    posts: collection({
      label: 'Posts', slugField: 'title', path: 'src/content/posts/*',
      format: { contentField: 'content' }, entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        // Keystatic datetime appends Z and drops seconds; text preserves legacy instants.
        pubDate: fields.text({
          label: 'Published (ISO 8601)',
          description: 'Include time and Pacific offset, e.g. 2025-08-30T10:00:00-07:00.',
          validation: { isRequired: true },
        }),
        description: fields.text({ label: 'Description', multiline: true }),
        categories: fields.array(fields.text({ label: 'Category' }), { label: 'Categories', itemLabel: (p) => p.value }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (p) => p.value }),
        heroImage: fields.text({ label: 'Hero image path', description: 'Root-relative path, e.g. /images/photo.jpg. Legacy upload paths must remain unchanged.' }),
        draft: fields.checkbox({ label: 'Draft' }),
        urlPath: fields.text({ label: 'Legacy URL path', description: 'Keep imported URLs unchanged; leave blank on new posts.' }),
        wpId: fields.integer({ label: 'WP id' }),
        content: markdownSource(),
      },
    }),
  },
  singletons: {
    about: singleton({
      label: 'About page', path: 'src/content/pages/about', format: { contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Title' }),
        content: markdownSource(),
      },
    }),
  },
});
