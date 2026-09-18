import { describe, expect, it } from 'vitest';
import { contactLinks, copyrightLine, displayUrl } from '../../src/lib/contact';

type ProfileModule = { frontmatter: { name: string; email: string; github: string; linkedin: string } };
const [profileModule] = Object.values(
  import.meta.glob('/src/content/profile/profile.md', { eager: true }) as Record<string, ProfileModule>,
);
const profile = profileModule?.frontmatter;

describe('displayUrl', () => {
  it.each([
    ['https://github.com/someone', 'github.com/someone'],
    ['http://github.com/someone', 'github.com/someone'],
    ['https://www.linkedin.com/in/someone', 'linkedin.com/in/someone'],
    ['https://www.linkedin.com/in/someone/', 'linkedin.com/in/someone'],
    ['https://example.com/', 'example.com'],
  ])('shows %s as %s', (url, text) => {
    expect(displayUrl(url)).toBe(text);
  });
});

describe('contactLinks', () => {
  const links = contactLinks({
    email: 'ana@example.com',
    github: 'https://github.com/ana',
    linkedin: 'https://www.linkedin.com/in/ana/',
  });

  it('lists email, GitHub and LinkedIn in that order with their icons', () => {
    expect(links.map(({ service, icon }) => [service, icon])).toEqual([
      ['Correo', 'mail'],
      ['GitHub', 'github'],
      ['LinkedIn', 'linkedin'],
    ]);
  });

  it('links the email with mailto: and shows the address as it is', () => {
    expect(links[0]).toMatchObject({ href: 'mailto:ana@example.com', text: 'ana@example.com' });
  });

  it('links the profiles to their URLs and shows them without protocol or www.', () => {
    expect(links[1]).toMatchObject({ href: 'https://github.com/ana', text: 'github.com/ana' });
    expect(links[2]).toMatchObject({ href: 'https://www.linkedin.com/in/ana/', text: 'linkedin.com/in/ana' });
  });

  it('shows the real profile data as the spec lists it', () => {
    expect(profile).toBeDefined();
    expect(contactLinks(profile!).map(({ text }) => text)).toEqual([
      'luisander.dev@gmail.com',
      'github.com/Luisander2651',
      'linkedin.com/in/luis-mario-gutierrez-valdovinos-6998a6357',
    ]);
  });
});

describe('copyrightLine', () => {
  it('puts the year before the name', () => {
    expect(copyrightLine('Ana Cruz', 2026)).toBe('© 2026 Ana Cruz');
  });
});
