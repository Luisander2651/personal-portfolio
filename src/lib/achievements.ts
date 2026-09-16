const LIST_ITEM = /^\s*[-*]\s+(.+?)\s*$/;

/** Returns the text of each markdown list item in a content entry body, in order. */
export function parseAchievements(body: string): string[] {
  const achievements = body
    .split('\n')
    .map((line) => line.match(LIST_ITEM)?.[1])
    .filter((text): text is string => text !== undefined);

  if (achievements.length === 0) {
    throw new Error('An entry body must list at least one achievement');
  }
  return achievements;
}
