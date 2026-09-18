/** Icons of the contact links (see `ContactIcon`). */
export type ContactIconName = 'mail' | 'github' | 'linkedin';

/** A contact link of the footer: service name, visible text, destination and icon. */
export type ContactLink = {
  service: string;
  text: string;
  href: string;
  icon: ContactIconName;
};

export type ContactProfile = {
  email: string;
  github: string;
  linkedin: string;
};

/** A URL as it reads to a person: no protocol, no `www.` and no trailing slash. */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
}

/** The footer contact links in page order: email, GitHub and LinkedIn (specs/011-footer). */
export function contactLinks({ email, github, linkedin }: ContactProfile): ContactLink[] {
  return [
    { service: 'Correo', text: email, href: `mailto:${email}`, icon: 'mail' },
    { service: 'GitHub', text: displayUrl(github), href: github, icon: 'github' },
    { service: 'LinkedIn', text: displayUrl(linkedin), href: linkedin, icon: 'linkedin' },
  ];
}

/** Copyright line of the footer: "© {year} {name}". */
export function copyrightLine(name: string, year: number): string {
  return `© ${year} ${name}`;
}
