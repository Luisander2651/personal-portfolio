import { describe, expect, it } from 'vitest';
import workflow from '../../.github/workflows/ci.yml?raw';
import packageJson from '../../package.json';

const lines = workflow.split('\n').map((line) => line.trim());
const indexOf = (pattern: RegExp) => lines.findIndex((line) => pattern.test(line));

describe('continuous integration workflow', () => {
  it('runs on pushes to main and on pull requests', () => {
    expect(workflow).toMatch(/^on:/m);
    expect(workflow).toMatch(/push:\s*\n\s*branches:\s*\[\s*main\s*\]/);
    expect(workflow).toMatch(/pull_request:/);
  });

  it('checks the repository out and sets Bun up', () => {
    expect(workflow).toMatch(/uses:\s*actions\/checkout@/);
    expect(workflow).toMatch(/uses:\s*oven-sh\/setup-bun@/);
  });

  it('installs with the lockfile and runs the tests before the build', () => {
    const install = indexOf(/bun install --frozen-lockfile/);
    const test = indexOf(/bun run test/);
    const build = indexOf(/bun run build/);

    expect(install).toBeGreaterThan(-1);
    expect(test).toBeGreaterThan(install);
    expect(build).toBeGreaterThan(test);
  });

  it('neither deploys nor uses secrets of its own', () => {
    // Comments may mention the spec (014-deployment); only the steps matter here.
    const steps = lines.filter((line) => !line.startsWith('#')).join('\n');

    expect(steps).not.toMatch(/secrets\./);
    expect(steps).not.toMatch(/^\s*env:/m);
    expect(steps.toLowerCase()).not.toMatch(/vercel|deploy/);
  });

  it('adds no dependencies to the project', () => {
    expect(Object.keys(packageJson.dependencies)).toEqual(['astro']);
    expect(Object.keys(packageJson.devDependencies).sort()).toEqual(['@astrojs/check', 'typescript', 'vitest']);
  });
});
