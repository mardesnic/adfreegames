import { describe, expect, it } from 'vitest';

import { LEVELS } from './levels';
import { noDeadEnds, shortest } from './skeleton';

describe('levels', () => {
  it.each(LEVELS.map((l) => [l.id, l]))('level %s can be won', (_, l) => {
    expect(l.skeleton).toBeGreaterThanOrEqual(0);
    expect(l.skull).toBeGreaterThanOrEqual(0);
    expect(shortest(l)).toBeLessThan(Infinity);
    expect(noDeadEnds(l)).toBe(true);
  });

  it('gets harder, not easier', () => {
    const lengths = LEVELS.map(shortest);
    expect(lengths[0]).toBeLessThanOrEqual(2);
    for (let k = 2; k < lengths.length; k++)
      expect(lengths[k]).toBeGreaterThan(lengths[k - 1]);
  });

  it('has at most one piano in a room', () => {
    for (const l of LEVELS)
      expect(l.tiles.filter((t) => t === 'piano').length).toBeLessThanOrEqual(
        1
      );
  });

  it('has portrait boards', () => {
    for (const l of LEVELS) expect(l.height).toBeGreaterThan(l.width);
  });
});
