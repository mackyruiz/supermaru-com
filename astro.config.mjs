// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://www.supermaru.com',
  // Keystatic's local API calls omit trailing slashes; production URLs retain them.
  trailingSlash: isDev ? 'ignore' : 'always',
  integrations: [
    expressiveCode({
      themes: ['github-dark-default', 'github-light-default'],
      styleOverrides: { borderRadius: '0.4rem' },
    }),
    sitemap(),
    ...(isDev ? [react(), keystatic()] : []),
  ],
});
