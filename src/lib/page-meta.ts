type ProfileMetaSource = { name: string; role: string; summary: string };

export type PageMeta = { title: string; description: string };

/** Builds the page title ("Name — Role") and description from the profile. */
export function getPageMeta({ name, role, summary }: ProfileMetaSource): PageMeta {
  return {
    title: `${name} — ${role}`,
    description: summary,
  };
}
