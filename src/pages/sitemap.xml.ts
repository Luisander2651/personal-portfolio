import type { APIRoute } from 'astro';
import { canonicalUrl, sitemapXml } from '../lib/seo';

/** Sitemap of the site: only the home (specs/012-seo-metadata, CA-1.2). */
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Missing `site` in astro.config.mjs');
  return new Response(sitemapXml([canonicalUrl(site)]), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
