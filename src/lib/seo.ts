/*
 * Search engine and sharing metadata (specs/012-seo-metadata): canonical URL, sitemap,
 * robots.txt, schema.org Person and Open Graph tags. Everything derives from the site URL and
 * the profile.
 */

type Site = string | URL;

/** Open Graph image (public/og-image.png) and its size (designs/012-seo-metadata). */
const OG_IMAGE = { path: 'og-image.png', width: 1200, height: 630 };
const OG_LOCALE = 'es_MX';

/** Absolute URL of the home page, with a trailing slash. */
export function canonicalUrl(site: Site): string {
  return new URL('/', site).href;
}

const escapeXml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/** XML sitemap listing the given absolute URLs. */
export function sitemapXml(urls: readonly string[]): string {
  const entries = urls.map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

/** robots.txt that allows every crawler and points to the sitemap. */
export function robotsTxt(site: Site): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`;
}

/** "Estado de México, México" → region "Estado de México", country "México". */
export function splitLocation(location: string): { region: string | undefined; country: string } {
  const parts = location.split(',').map((part) => part.trim());
  const country = parts.pop() ?? '';
  return { region: parts.length > 0 ? parts.join(', ') : undefined, country };
}

export type PersonProfile = {
  name: string;
  role: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
};

/** schema.org Person for the JSON-LD of the home page. */
export function personJsonLd({ name, role, location, email, github, linkedin }: PersonProfile, site: Site) {
  const { region, country } = splitLocation(location);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: role,
    url: canonicalUrl(site),
    email: `mailto:${email}`,
    address: { '@type': 'PostalAddress', addressRegion: region, addressCountry: country },
    sameAs: [github, linkedin],
  };
}

export type OpenGraphTag = { property: string; content: string };

/** Open Graph tags of the home page; the image alt is the page title ("Name — Role"). */
export function openGraphTags({
  title,
  description,
  siteName,
  site,
}: {
  title: string;
  description: string;
  siteName: string;
  site: Site;
}): OpenGraphTag[] {
  return [
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: siteName },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl(site) },
    { property: 'og:locale', content: OG_LOCALE },
    { property: 'og:image', content: new URL(`/${OG_IMAGE.path}`, site).href },
    { property: 'og:image:width', content: String(OG_IMAGE.width) },
    { property: 'og:image:height', content: String(OG_IMAGE.height) },
    { property: 'og:image:alt', content: title },
  ];
}
