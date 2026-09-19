import { describe, expect, it } from 'vitest';
// Vite imports (as the rest of the tests do): PNG files inline as base64 data URLs, the SVG as text.
import appleTouchIcon from '../../public/apple-touch-icon.png?inline';
import favicon32 from '../../public/favicon-32.png?inline';
import faviconSvg from '../../public/favicon.svg?raw';
import ogImage from '../../public/og-image.png?inline';

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/** Bytes of a `data:image/png;base64,…` URL. */
function bytesOf(dataUrl: string): Uint8Array {
  expect(dataUrl.startsWith('data:image/png;base64,')).toBe(true);
  const binary = atob(dataUrl.slice(dataUrl.indexOf(',') + 1));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

/** Width and height from the IHDR chunk of a PNG file (after the 8-byte signature). */
function pngSize(dataUrl: string): { width: number; height: number } {
  const bytes = bytesOf(dataUrl);
  const view = new DataView(bytes.buffer);
  expect([...bytes.subarray(0, 8)]).toEqual(PNG_SIGNATURE);
  expect(String.fromCharCode(...bytes.subarray(12, 16))).toBe('IHDR');
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

describe('brand assets in public/', () => {
  it('has a 1200×630 Open Graph image of at most 300 kB', () => {
    expect(pngSize(ogImage)).toEqual({ width: 1200, height: 630 });
    expect(bytesOf(ogImage).length).toBeLessThanOrEqual(300 * 1024);
  });

  it.each([
    ['favicon-32.png', favicon32, 32],
    ['apple-touch-icon.png', appleTouchIcon, 180],
  ])('has %s at its size', (_name, dataUrl, size) => {
    expect(pngSize(dataUrl)).toEqual({ width: size, height: size });
  });

  describe('favicon.svg', () => {
    it('is an SVG on the 64-unit grid of the design', () => {
      expect(faviconSvg).toMatch(/^<svg\b[^>]*\sxmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
      expect(faviconSvg).toMatch(/^<svg\b[^>]*\sviewBox="0 0 64 64"/);
      expect(faviconSvg.trim().endsWith('</svg>')).toBe(true);
    });

    it('draws "LM" as paths, without text, filters, images or external resources', () => {
      expect(faviconSvg).toMatch(/<path\b/);
      expect(faviconSvg).not.toMatch(/<(text|filter|image|style|script|foreignObject)\b/);
      expect(faviconSvg).not.toMatch(/https?:\/\/(?!www\.w3\.org\/2000\/svg)/);
    });

    it('uses the design colors: background, strong border, text and glow', () => {
      for (const color of ['#05070D', '#263047', '#E6EDF7', '#22D3EE']) {
        expect(faviconSvg.toUpperCase()).toContain(color);
      }
    });
  });
});
