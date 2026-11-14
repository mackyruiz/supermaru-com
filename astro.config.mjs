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
      styleOverrides: {
        borderRadius: '10px',
        borderColor: ({ theme }) => theme.type === 'dark' ? 'oklch(31% 0.01 250)' : 'oklch(88% 0.008 85)',
        codeBackground: ({ theme }) => theme.type === 'dark' ? 'oklch(13.5% 0.007 250)' : 'oklch(96.5% 0.007 85)',
        codeFontFamily: "'Atkinson Hyperlegible Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        codeFontSize: '0.875rem',
        uiFontFamily: "'Host Grotesk', ui-sans-serif, system-ui, sans-serif",
        frames: { shadowColor: 'transparent', frameBoxShadowCssValue: 'none' },
      },
    }),
    sitemap(),
    ...(isDev ? [react(), keystatic()] : []),
  ],
});
