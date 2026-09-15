export type SkillPresentation = 'icons' | 'tags' | 'text';

type SkillEntry = { data: { order: number; presentation: SkillPresentation } };

export type SkillGroups<T> = Record<SkillPresentation, T[]>;

/**
 * Splits skill categories into the tech stack section groups (icons, tags and text),
 * each sorted by ascending `order`.
 */
export function groupSkillsForSection<T extends SkillEntry>(skills: readonly T[]): SkillGroups<T> {
  const seen = new Set<number>();
  for (const { data } of skills) {
    if (seen.has(data.order)) {
      throw new Error(`Duplicated skill category order ${data.order}`);
    }
    seen.add(data.order);
  }

  const sorted = [...skills].sort((a, b) => a.data.order - b.data.order);
  return {
    icons: sorted.filter(({ data }) => data.presentation === 'icons'),
    tags: sorted.filter(({ data }) => data.presentation === 'tags'),
    text: sorted.filter(({ data }) => data.presentation === 'text'),
  };
}
