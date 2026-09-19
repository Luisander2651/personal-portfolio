import type { APIRoute } from 'astro';
import { robotsTxt } from '../lib/seo';

/** Crawling rules pointing to the sitemap (specs/012-seo-metadata, CA-1.3). */
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Missing `site` in astro.config.mjs');
  return new Response(robotsTxt(site), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
