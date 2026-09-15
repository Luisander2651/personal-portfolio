import { describe, expect, it } from 'vitest';
import { planRevealChanges } from '../../src/lib/section-reveal';

const viewport = { height: 800, startDistance: 120 };

/** A block whose top edge is at `top` and that is `height` tall. */
const block = (target: string, top: number, height = 300, left = 0) => ({
  target,
  top,
  bottom: top + height,
  left,
});

describe('planRevealChanges', () => {
  it('reveals a block once its top edge has entered the start distance', () => {
    expect(planRevealChanges([block('a', 680)], viewport).reveal).toEqual(['a']);
    expect(planRevealChanges([block('b', 200)], viewport).reveal).toEqual(['b']);
  });

  it('does not reveal a block that has entered less than the start distance', () => {
    expect(planRevealChanges([block('peeking', 700)], viewport)).toEqual({ reveal: [], hide: [] });
  });

  it('reveals a short block that is fully visible before reaching the start distance', () => {
    const short = { target: 'last', top: 710, bottom: 790, left: 0 };

    expect(planRevealChanges([short], viewport).reveal).toEqual(['last']);
  });

  it('reveals a tall block that already covers the viewport', () => {
    expect(planRevealChanges([block('tall', -400, 2000)], viewport).reveal).toEqual(['tall']);
  });

  it('hides only blocks completely out of the viewport', () => {
    const { reveal, hide } = planRevealChanges(
      [block('below', 800), block('above', -300, 300), block('still-visible', -299, 300)],
      viewport,
    );

    expect(hide).toEqual(['below', 'above']);
    expect(reveal).toEqual(['still-visible']);
  });

  it('orders the blocks revealed together by reading order (top, then left)', () => {
    const { reveal } = planRevealChanges(
      [block('bottom-left', 400, 100, 0), block('top-right', 100, 100, 600), block('top-left', 100, 100, 0)],
      viewport,
    );

    expect(reveal).toEqual(['top-left', 'top-right', 'bottom-left']);
  });

  it('treats blocks on the same row (subpixel differences) as one row', () => {
    const { reveal } = planRevealChanges([block('right', 100.4, 100, 600), block('left', 100.2, 100, 0)], viewport);

    expect(reveal).toEqual(['left', 'right']);
  });

  it('does not mutate the measured blocks', () => {
    const blocks = [block('b', 300), block('a', 100)];
    const snapshot = structuredClone(blocks);

    planRevealChanges(blocks, viewport);

    expect(blocks).toEqual(snapshot);
  });
});
