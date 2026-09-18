import { describe, expect, it } from 'vitest';
import { statusLabel } from '../../src/lib/status';

describe('statusLabel', () => {
  it.each([
    ['completed', 'Finalizado'],
    ['in-progress', 'En curso'],
  ] as const)('labels %s as "%s"', (status, label) => {
    expect(statusLabel(status)).toBe(label);
  });
});
