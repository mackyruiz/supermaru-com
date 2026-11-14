// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  site: 'https://www.supermaru.com',
  trailingSlash: 'always',
  redirects: {
    '/2025/08/homelab-on-a-budget': '/projects/homelab-on-a-budget/',
    '/2025/08/h4x0r-j0y': '/projects/h4x0r-j0y/',
    '/2025/08/bsideslv-and-multi-cloud-security': '/projects/bsideslv-and-multi-cloud-security/',
    '/2020/07/listing-network-devices-from-cisco-dnac-via-apis-devnet': '/projects/listing-network-devices-from-cisco-dnac-via-apis-devnet/',
    '/2018/12/ethical-hacking-final-fall-2018-mission-college': '/projects/ethical-hacking-final-fall-2018-mission-college/',
    '/2018/11/hackthissite-org-basic-2-and-3': '/projects/hackthissite-org-basic-2-and-3/',
    '/2018/10/ethical-hacking-midterm-fall-2018-mission-college': '/projects/ethical-hacking-midterm-fall-2018-mission-college/',
    '/2017/02/tv-dashboards': '/projects/tv-dashboards/',
    '/2015/10/vcsa-6-0-automated-deployment': '/projects/vcsa-6-0-automated-deployment/',
    '/2015/05/raspberry-pi-console-server': '/projects/raspberry-pi-console-server/',
  },
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
  ],
});
