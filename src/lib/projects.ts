type OrderedEntry = { data: { order: number } };

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
