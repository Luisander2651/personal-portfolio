type ProfileMetaSource = { name: string; role: string; summary: string };

export type PageMeta = { title: string; description: string };

/** Builds the page title ("Name — Role") and description from the profile. */
export function getPageMeta({ name, role, summary }: ProfileMetaSource): PageMeta {
  return {
    title: `${name} — ${role}`,
    description: summary,
  };
}

/** Title and description of the 404 page (specs/013-not-found-page). */
export function getNotFoundMeta({ name }: Pick<ProfileMetaSource, 'name'>): PageMeta {
  return {
    title: `Página no encontrada — ${name}`,
    description: 'La ruta que buscas no existe o se ha movido.',
  };
}
