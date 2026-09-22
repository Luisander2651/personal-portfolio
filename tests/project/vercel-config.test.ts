import { describe, expect, it } from 'vitest';
import vercelJson from '../../vercel.json?raw';

const config = JSON.parse(vercelJson) as {
  headers?: { source: string; headers: { key: string; value: string }[] }[];
  [key: string]: unknown;
};

const ruleFor = (source: string) => config.headers?.find((rule) => rule.source === source);

const valueOf = (source: string, key: string) =>
  ruleFor(source)?.headers.find((header) => header.key === key)?.value;

describe('hosting configuration', () => {
  it('is valid JSON with a headers list', () => {
    expect(Array.isArray(config.headers)).toBe(true);
    expect(config.headers?.length).toBeGreaterThan(0);
  });

  it('caches the hashed assets for a year', () => {
    expect(valueOf('/_astro/(.*)', 'Cache-Control')).toBe('public, max-age=31536000, immutable');
  });

  it('sends the security headers on every route', () => {
    expect(valueOf('/(.*)', 'X-Content-Type-Options')).toBe('nosniff');
    expect(valueOf('/(.*)', 'Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(valueOf('/(.*)', 'X-Frame-Options')).toBe('DENY');

    const permissions = valueOf('/(.*)', 'Permissions-Policy');
    expect(permissions).toBeDefined();
    for (const feature of ['camera', 'microphone', 'geolocation']) {
      expect(permissions).toMatch(new RegExp(`${feature}=\\(\\)`));
    }
  });

  it('changes none of the routes verified by the specs 012 and 013', () => {
    expect(Object.keys(config)).toEqual(['headers']);
  });
});
