import { describe, expect, it } from 'vitest';

import {
  LEVELS,
  PICTURES,
  SIZES,
  flip,
  hide,
  initialStats,
  isMiss,
  isSolved,
  newRound,
  pairsOf,
  recordWin,
  type Round,
} from './game';

const round = (cards: string[]): Round => ({
  level: 'easy',
  cards,
  found: [],
  open: [],
});

describe('pictures', () => {
  it('are all different', () => {
    expect(new Set(PICTURES).size).toBe(PICTURES.length);
  });

  it('are enough for the biggest board twice over', () => {
    expect(PICTURES.length).toBeGreaterThanOrEqual(2 * pairsOf('hard'));
  });
});

describe('turning cards', () => {
  it('keeps a pair face up', () => {
    let r = round(['🐶', '🐱', '🐶', '🐱']);
    r = flip(r, 0);
    expect(r.open).toEqual([0]);
    r = flip(r, 2);
    expect(r.found).toEqual([0, 2]);
    expect(r.open).toEqual([]);
  });

  it('shows two different cards, then turns them back', () => {
    let r = flip(flip(round(['🐶', '🐱', '🐶', '🐱']), 0), 1);
    expect(isMiss(r)).toBe(true);
    expect(r.open).toEqual([0, 1]);
    expect(hide(r).open).toEqual([]);
  });

  it('turns two different cards back when a third is tapped', () => {
    const r = flip(flip(flip(round(['🐶', '🐱', '🐶', '🐱']), 0), 1), 3);
    expect(r.open).toEqual([3]);
  });

  it('keeps one of two different cards up when it is tapped again', () => {
    const r = flip(flip(flip(round(['🐶', '🐱', '🐶', '🐱']), 0), 1), 1);
    expect(r.open).toEqual([1]);
  });

  it('does nothing for a card already face up', () => {
    let r = flip(round(['🐶', '🐱', '🐶', '🐱']), 0);
    expect(flip(r, 0)).toBe(r);
    r = flip(r, 2);
    expect(flip(r, 2)).toBe(r);
    expect(flip(r, 9)).toBe(r);
  });

  it('is solved with every pair found', () => {
    let r = round(['🐶', '🐱', '🐶', '🐱']);
    for (const c of [0, 2, 1, 3]) r = flip(r, c);
    expect(isSolved(r)).toBe(true);
    expect(recordWin(initialStats, r).easy.solved).toBe(1);
    expect(recordWin(initialStats, round(['🐶', '🐶']))).toBe(initialStats);
  });
});

describe('new games', () => {
  it('have two of each picture and fill the board', () => {
    for (const level of LEVELS) {
      const r = newRound(level);
      const [cols, rows] = SIZES[level];
      expect(r.cards).toHaveLength(cols * rows);
      const counts = new Map<string, number>();
      for (const c of r.cards) counts.set(c, (counts.get(c) ?? 0) + 1);
      expect([...counts.values()].every((n) => n === 2)).toBe(true);
      expect(counts.size).toBe(pairsOf(level));
    }
  });

  it('use other pictures than the last game', () => {
    for (const level of LEVELS) {
      const last = newRound(level);
      const r = newRound(level, Math.random, last);
      expect(r.cards.filter((c) => last.cards.includes(c))).toEqual([]);
    }
  });
});
