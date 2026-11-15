import { describe, expect, it } from 'vitest';

import {
  LEVELS,
  LIT,
  SIZES,
  initialStats,
  isMiss,
  isSolved,
  newRound,
  recordWin,
  restart,
  tap,
  type Round,
} from './game';

const round = (pattern: number[], found: number[] = []): Round => ({
  level: 'easy',
  pattern,
  found,
});

describe('tapping', () => {
  it('keeps a square of the pattern lit', () => {
    const r = tap(round([0, 4, 8]), 4);
    expect(r.found).toEqual([4]);
    expect(isSolved(r)).toBe(false);
  });

  it('is solved when every square is found, in any order', () => {
    let r = round([0, 4, 8]);
    for (const s of [8, 0, 4]) r = tap(r, s);
    expect(isSolved(r)).toBe(true);
  });

  it('does nothing for a square already found or not in the pattern', () => {
    const r = round([0, 4, 8], [4]);
    expect(tap(r, 4)).toBe(r);
    expect(tap(r, 1)).toBe(r);
  });

  it('calls a square outside the pattern a miss', () => {
    const r = round([0, 4, 8], [4]);
    expect(isMiss(r, 1)).toBe(true);
    expect(isMiss(r, 4)).toBe(false);
    expect(isMiss(r, 0)).toBe(false);
    expect(isMiss(r, 9)).toBe(false);
    expect(isMiss(round([0, 4, 8], [0, 4, 8]), 1)).toBe(false);
  });
});

describe('a wrong square', () => {
  it('starts the pattern over', () => {
    expect(restart(round([0, 4, 8], [0, 4])).found).toEqual([]);
  });

  it('leaves a solved pattern as it is', () => {
    const r = round([0, 4, 8], [0, 4, 8]);
    expect(restart(r)).toBe(r);
  });
});

describe('new games', () => {
  it('light the number of squares of the level, all on the grid', () => {
    for (const level of LEVELS)
      for (let i = 0; i < 200; i++) {
        const r = newRound(level);
        expect(new Set(r.pattern).size).toBe(LIT[level]);
        for (const s of r.pattern) {
          expect(s).toBeGreaterThanOrEqual(0);
          expect(s).toBeLessThan(SIZES[level] ** 2);
        }
        expect(r.found).toEqual([]);
      }
  });

  it('are not the same pattern twice in a row', () => {
    let last = newRound('easy');
    for (let i = 0; i < 200; i++) {
      const r = newRound('easy', Math.random, last);
      expect(r.pattern).not.toEqual(last.pattern);
      last = r;
    }
  });

  it('count a win', () => {
    expect(recordWin(initialStats, round([1], [1])).easy.solved).toBe(1);
    expect(recordWin(initialStats, round([1]))).toBe(initialStats);
  });
});
