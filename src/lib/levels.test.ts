import { describe, expect, it } from 'vitest';

import { LEVELS, ROOMS } from './levels';
import { noDeadEnds, parse, shortest } from './skeleton';

describe('levels', () => {
  it.each(LEVELS.map((l) => [l.id, l]))('level %s can be won', (_, l) => {
    expect(l.skeleton).toBeGreaterThanOrEqual(0);
    expect(l.skull).toBeGreaterThanOrEqual(0);
    expect(shortest(l)).toBeLessThan(Infinity);
    expect(noDeadEnds(l)).toBe(true);
  });

  it('starts easy, and gets harder in each kind of room', () => {
    expect(shortest(LEVELS[0])).toBeLessThanOrEqual(2);
    for (const room of ROOMS) {
      const lengths = room.map((rows) => shortest(parse('x', rows)));
      for (let k = 1; k < lengths.length; k++)
        expect(lengths[k]).toBeGreaterThan(lengths[k - 1]);
    }
  });

  it('needs the skull to roll under a bed and through a bookcase', () => {
    for (const rows of ROOMS.flat())
      for (const [letter, tile] of [
        ['b', 'bed'],
        ['d', 'bookcase'],
      ])
        if (rows.join('').includes(letter)) {
          const blocked = rows.map((r) => r.replaceAll(letter, '#'));
          expect(shortest(parse('x', blocked)), tile).toBe(Infinity);
        }
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
