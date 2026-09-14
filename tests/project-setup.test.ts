import { describe, expect, it } from 'vitest';
import gitignore from '../.gitignore?raw';
import packageJson from '../package.json';
import tsconfig from '../tsconfig.json';

const scripts: Record<string, string | undefined> = packageJson.scripts;
const lockfiles = Object.keys(
  import.meta.glob(['/bun.lock', '/package-lock.json', '/yarn.lock', '/pnpm-lock.yaml']),
);

describe('project setup', () => {
  describe('package scripts', () => {
    it.each(['dev', 'build', 'preview', 'test', 'check'])('exposes the "%s" script', (name) => {
      expect(scripts[name]).toBeTypeOf('string');
    });

    it('runs Vitest once, without watch mode', () => {
      expect(scripts.test).toMatch(/\bvitest run\b/);
    });

    it('type-checks with astro check', () => {
      expect(scripts.check).toMatch(/\bastro check\b/);
    });

    it('type-checks before building', () => {
      const build = scripts.build ?? '';
      const checkAt = build.search(/\bastro check\b/);
      const buildAt = build.search(/\bastro build\b/);

      expect(checkAt).toBeGreaterThanOrEqual(0);
      expect(buildAt).toBeGreaterThan(checkAt);
    });
  });

  it('keeps exactly the dependencies of the foundation spec', () => {
    expect(Object.keys(packageJson.dependencies).sort()).toEqual(['astro']);
    expect(Object.keys(packageJson.devDependencies).sort()).toEqual(['@astrojs/check', 'typescript', 'vitest']);
  });

  describe('package manager', () => {
    it('uses a Bun lockfile', () => {
      expect(lockfiles).toContain('/bun.lock');
    });

    it.each(['/package-lock.json', '/yarn.lock', '/pnpm-lock.yaml'])('has no %s', (lockfile) => {
      expect(lockfiles).not.toContain(lockfile);
    });
  });

  it('extends the strict TypeScript config from Astro', () => {
    expect(tsconfig.extends).toBe('astro/tsconfigs/strict');
  });

  it.each(['node_modules/', 'dist/', '.astro/', '.env*'])('ignores %s in git', (entry) => {
    const entries = gitignore.split(/\r?\n/).map((line) => line.trim());
    expect(entries).toContain(entry);
  });
});
