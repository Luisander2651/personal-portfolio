import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ProfileHeading from '../../src/components/ProfileHeading.astro';

const props = { name: 'Persona de Prueba', role: 'Rol de Prueba' };

describe('ProfileHeading', () => {
  let html = '';

  beforeAll(async () => {
    const container = await AstroContainer.create();
    html = await container.renderToString(ProfileHeading, { props });
  });

  it('renders a single h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  });

  it('shows the name and role inside the h1', () => {
    const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';

    expect(heading).toContain(props.name);
    expect(heading).toContain(props.role);
  });

  it('does not include client-side scripts', () => {
    expect(html).not.toMatch(/<script/i);
  });
});
