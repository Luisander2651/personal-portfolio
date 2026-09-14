import { describe, expect, it } from 'vitest';
import { getPageMeta } from '../../src/lib/page-meta';

const profile = {
  name: 'Test Person',
  role: 'Test Role',
  summary: 'Test summary of the profile.',
};

describe('getPageMeta', () => {
  it('composes the title as "Name — Role"', () => {
    expect(getPageMeta(profile).title).toBe('Test Person — Test Role');
  });

  it('uses the profile summary as description', () => {
    expect(getPageMeta(profile).description).toBe('Test summary of the profile.');
  });
});
