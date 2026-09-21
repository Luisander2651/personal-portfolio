import { describe, expect, it } from 'vitest';
import { getNotFoundMeta, getPageMeta } from '../../src/lib/page-meta';

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

describe('getNotFoundMeta', () => {
  it('titles the 404 page "Página no encontrada — Name" and explains it in the description', () => {
    expect(getNotFoundMeta(profile)).toEqual({
      title: 'Página no encontrada — Test Person',
      description: 'La ruta que buscas no existe o se ha movido.',
    });
  });
});
