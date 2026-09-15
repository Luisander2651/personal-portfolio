type OrderedEntry = { data: { order: number } };
type FeaturedEntry = { data: { order: number; featured: boolean } };

export type ProjectStatus = 'completed' | 'in-progress';

export type ProjectGroups<T> = { featured: T[]; rest: T[] };

const LIST_ITEM = /^\s*[-*]\s+(.+?)\s*$/;

const STATUS_LABELS: Record<ProjectStatus, string> = {
  completed: 'Finalizado',
  'in-progress': 'En curso',
};

/** Returns a new list of projects sorted by ascending `order`. */
export function sortProjects<T extends OrderedEntry>(projects: readonly T[]): T[] {
  const seen = new Set<number>();
  for (const { data } of projects) {
    if (seen.has(data.order)) {
      throw new Error(`Duplicated project order ${data.order}`);
    }
    seen.add(data.order);
  }

  return [...projects].sort((a, b) => a.data.order - b.data.order);
}

/** Splits the projects into the featured block and the rest, each sorted by ascending `order`. */
export function groupProjectsForSection<T extends FeaturedEntry>(projects: readonly T[]): ProjectGroups<T> {
  const sorted = sortProjects(projects);
  return {
    featured: sorted.filter(({ data }) => data.featured),
    rest: sorted.filter(({ data }) => !data.featured),
  };
}

/** Returns the text of each markdown list item in a project entry body, in order. */
export function parseProjectAchievements(body: string): string[] {
  const achievements = body
    .split('\n')
    .map((line) => line.match(LIST_ITEM)?.[1])
    .filter((text): text is string => text !== undefined);

  if (achievements.length === 0) {
    throw new Error('A project body must list at least one achievement');
  }
  return achievements;
}

/** Visible label of a project status. */
export function projectStatusLabel(status: ProjectStatus): string {
  return STATUS_LABELS[status];
}
