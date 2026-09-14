import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const readText = (file: string) => readFileSync(resolve(root, file), 'utf-8');
const readJson = (file: string) => JSON.parse(readText(file));

describe('project setup', () => {
  describe('package scripts', () => {
    const { scripts = {} } = readJson('package.json');

    it.each(['dev', 'build', 'preview', 'test'])('exposes the "%s" script', (name) => {
      expect(scripts[name]).toBeTypeOf('string');
    });

    it('runs Vitest once, without watch mode', () => {
      expect(scripts.test).toMatch(/\bvitest run\b/);
    });
  });

  describe('package manager', () => {
    it('uses a Bun lockfile', () => {
      expect(existsSync(resolve(root, 'bun.lock'))).toBe(true);
    });

    it.each(['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'])('has no %s', (lockfile) => {
      expect(existsSync(resolve(root, lockfile))).toBe(false);
    });
  });

  it('extends the strict TypeScript config from Astro', () => {
    expect(readJson('tsconfig.json').extends).toBe('astro/tsconfigs/strict');
  });

  it.each(['node_modules/', 'dist/', '.astro/', '.env*'])('ignores %s in git', (entry) => {
    const entries = readText('.gitignore').split(/\r?\n/).map((line) => line.trim());
    expect(entries).toContain(entry);
  });
});
