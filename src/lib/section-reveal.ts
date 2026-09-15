/** Visible share of a block from which it is revealed (design system constant, P-1). */
export const REVEAL_THRESHOLD = 0.1;

/** Blocks whose top edges differ less than this are read as the same row. */
const SAME_ROW_TOLERANCE = 1;

export type RevealVisibilityChange<T> = {
  target: T;
  isIntersecting: boolean;
  /** Visible share of the block, from 0 to 1. */
  visibleRatio: number;
  top: number;
  left: number;
};

export type RevealPlan<T> = {
  /** Blocks to reveal, in reading order (their stagger order). */
  reveal: T[];
  /** Blocks that left the viewport completely and go back to hidden. */
  hide: T[];
};

/**
 * Decides which observed blocks become revealed (at least `REVEAL_THRESHOLD` visible) and
 * which go back to hidden (completely out of the viewport). Blocks in between keep their state.
 */
export function planRevealChanges<T>(changes: readonly RevealVisibilityChange<T>[]): RevealPlan<T> {
  const entering = changes
    .filter(({ isIntersecting, visibleRatio }) => isIntersecting && visibleRatio >= REVEAL_THRESHOLD)
    .sort((a, b) => (Math.abs(a.top - b.top) < SAME_ROW_TOLERANCE ? a.left - b.left : a.top - b.top));

  return {
    reveal: entering.map(({ target }) => target),
    hide: changes.filter(({ isIntersecting }) => !isIntersecting).map(({ target }) => target),
  };
}
