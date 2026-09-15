import { describe, expect, it } from 'vitest';
import { REVEAL_THRESHOLD, planRevealChanges } from '../../src/lib/section-reveal';

const change = (target: string, visibleRatio: number, top = 0, left = 0) => ({
  target,
  isIntersecting: visibleRatio > 0,
  visibleRatio,
  top,
  left,
});

describe('REVEAL_THRESHOLD', () => {
  it('is the 10 % of the design system', () => {
    expect(REVEAL_THRESHOLD).toBe(0.1);
  });
});

describe('planRevealChanges', () => {
  it('reveals blocks at least 10 % visible', () => {
    expect(planRevealChanges([change('a', 0.1), change('b', 0.6)]).reveal).toEqual(['a', 'b']);
  });

  it('hides only blocks completely out of the viewport', () => {
    const { reveal, hide } = planRevealChanges([change('out', 0), change('almost', 0.05)]);

    expect(hide).toEqual(['out']);
    expect(reveal).toEqual([]);
  });

  it('leaves blocks between both thresholds unchanged', () => {
    expect(planRevealChanges([change('edge', 0.04)])).toEqual({ reveal: [], hide: [] });
  });

  it('orders the blocks entering together by reading order (top, then left)', () => {
    const { reveal } = planRevealChanges([
      change('bottom-left', 0.5, 400, 0),
      change('top-right', 0.5, 100, 600),
      change('top-left', 0.5, 100, 0),
    ]);

    expect(reveal).toEqual(['top-left', 'top-right', 'bottom-left']);
  });

  it('treats blocks on the same row (subpixel differences) as one row', () => {
    const { reveal } = planRevealChanges([change('right', 0.5, 100.4, 600), change('left', 0.5, 100.2, 0)]);

    expect(reveal).toEqual(['left', 'right']);
  });

  it('does not mutate the observed changes', () => {
    const changes = [change('b', 0.5, 200), change('a', 0.5, 100)];
    const snapshot = structuredClone(changes);

    planRevealChanges(changes);

    expect(changes).toEqual(snapshot);
  });
});
