type OrderedEntry = { data: { order: number } };

/** Returns a new list of education entries sorted by ascending `order`. */
export function sortEducation<T extends OrderedEntry>(entries: readonly T[]): T[] {
  const seen = new Set<number>();
  for (const { data } of entries) {
    if (seen.has(data.order)) {
      throw new Error(`Duplicated education order ${data.order}`);
    }
    seen.add(data.order);
  }

  return [...entries].sort((a, b) => a.data.order - b.data.order);
}

/** Years of an education entry as written in the CV: `2025 – 2026`, or one year if both match. */
export function formatYearRange(startYear: number, endYear: number): string {
  return startYear === endYear ? String(startYear) : `${startYear} – ${endYear}`;
}
