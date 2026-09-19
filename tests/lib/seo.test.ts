import { describe, expect, it } from 'vitest';
import astroConfig from '../../astro.config.mjs';
import { getPageMeta } from '../../src/lib/page-meta';
import { canonicalUrl, openGraphTags, personJsonLd, robotsTxt, sitemapXml, splitLocation } from '../../src/lib/seo';

type Profile = {
  name: string;
  role: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  summary: string;
};
const [profileModule] = Object.values(
  import.meta.glob('/src/content/profile/profile.md', { eager: true }) as Record<string, { frontmatter: Profile }>,
);
const profile = profileModule!.frontmatter;

const SITE = 'https://personal-portfolio-lemon-three-51.vercel.app';
const HOME = `${SITE}/`;

describe('site configuration', () => {
  it('sets the public URL of the site', () => {
    expect(String(astroConfig.site)).toBe(SITE);
  });
});

describe('canonicalUrl', () => {
  it.each([SITE, `${SITE}/`, new URL(SITE)])('is the home URL with a trailing slash for %s', (site) => {
    expect(canonicalUrl(site)).toBe(HOME);
  });
});

describe('sitemapXml', () => {
  const xml = sitemapXml([HOME]);

  it('is an XML sitemap with a single url for the home', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml.match(/<url>/g)).toHaveLength(1);
    expect(xml).toContain(`<loc>${HOME}</loc>`);
  });

  it('escapes special characters in the URLs', () => {
    expect(sitemapXml(['https://example.com/?a=1&b=2'])).toContain('<loc>https://example.com/?a=1&amp;b=2</loc>');
  });
});

describe('robotsTxt', () => {
  it('allows every crawler and points to the sitemap', () => {
    expect(robotsTxt(SITE).split('\n')).toEqual(['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE}/sitemap.xml`, '']);
  });
});

describe('splitLocation', () => {
  it('splits region and country', () => {
    expect(splitLocation('Estado de México, México')).toEqual({ region: 'Estado de México', country: 'México' });
  });

  it('keeps a location without comma as the country', () => {
    expect(splitLocation('México')).toEqual({ region: undefined, country: 'México' });
  });
});

describe('personJsonLd', () => {
  const person = personJsonLd(profile, SITE);

  it('describes the author as a schema.org Person from the profile', () => {
    expect(JSON.parse(JSON.stringify(person))).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Luis Mario Gutiérrez Valdovinos',
      jobTitle: 'Ingeniero de Software Backend / Full Stack',
      url: HOME,
      email: 'mailto:luisander.dev@gmail.com',
      address: { '@type': 'PostalAddress', addressRegion: 'Estado de México', addressCountry: 'México' },
      sameAs: ['https://github.com/Luisander2651', 'https://www.linkedin.com/in/luis-mario-gutierrez-valdovinos-6998a6357'],
    });
  });
});

describe('openGraphTags', () => {
  const meta = getPageMeta(profile);
  const tags = Object.fromEntries(openGraphTags({ ...meta, siteName: profile.name, site: SITE }).map(({ property, content }) => [property, content]));

  it('has the ten Open Graph tags of the spec', () => {
    expect(tags).toEqual({
      'og:type': 'website',
      'og:site_name': 'Luis Mario Gutiérrez Valdovinos',
      'og:title': 'Luis Mario Gutiérrez Valdovinos — Ingeniero de Software Backend / Full Stack',
      'og:description': profile.summary,
      'og:url': HOME,
      'og:locale': 'es_MX',
      'og:image': `${SITE}/og-image.png`,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': 'Luis Mario Gutiérrez Valdovinos — Ingeniero de Software Backend / Full Stack',
    });
  });
});
