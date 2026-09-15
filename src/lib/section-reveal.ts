/** Blocks whose top edges differ less than this are read as the same row. */
const SAME_ROW_TOLERANCE = 1;

/** A revealable block measured against the viewport (like `getBoundingClientRect`). */
export type RevealBlock<T> = {
  target: T;
  top: number;
  bottom: number;
  left: number;
};

export type RevealViewport = {
  height: number;
  /** How far the block's top edge must have entered the viewport (`--reveal-start-distance`). */
  startDistance: number;
};

export type RevealPlan<T> = {
  /** Blocks to reveal, in reading order (their stagger order). */
  reveal: T[];
  /** Blocks that are completely out of the viewport and go back to hidden. */
  hide: T[];
};

/**
 * Decides which blocks become revealed — their top edge has entered `startDistance`, or they
 * are fully visible — and which go back to hidden (completely out of the viewport). Blocks in
 * between keep their state.
 */
export function planRevealChanges<T>(blocks: readonly RevealBlock<T>[], viewport: RevealViewport): RevealPlan<T> {
  const { height, startDistance } = viewport;
  const isOutside = ({ top, bottom }: RevealBlock<T>) => bottom <= 0 || top >= height;
  const hasEntered = ({ top, bottom }: RevealBlock<T>) =>
    top <= height - startDistance || (top >= 0 && bottom <= height);

  const entering = blocks
    .filter((block) => !isOutside(block) && hasEntered(block))
    .sort((a, b) => (Math.abs(a.top - b.top) < SAME_ROW_TOLERANCE ? a.left - b.left : a.top - b.top));

  return {
    reveal: entering.map(({ target }) => target),
    hide: blocks.filter(isOutside).map(({ target }) => target),
  };
}
