// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  // Public URL (specs/012-seo-metadata): canonical, sitemap, robots.txt and Open Graph derive from it.
  site: 'https://personal-portfolio-lemon-three-51.vercel.app',
  output: 'static',
  // Self-hosted design system fonts (designs/000-design-system/design.md, "Carga de fuentes").
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
  ],
});
