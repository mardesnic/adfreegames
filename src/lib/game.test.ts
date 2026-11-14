import { describe, expect, it } from 'vitest';

import { isOpen, newGame, nextLevel, play, recordWin, savedGame } from './game';
import { LEVELS } from './levels';

describe('game', () => {
  it('wins the first level by walking right twice', () => {
    let g = newGame(LEVELS[0].id);
    g = play(g, 'right').game;
    expect(g.won).toBe(false);
    g = play(g, 'right').game;
    expect(g.won).toBe(true);
    expect(play(g, 'left').game).toBe(g);
  });

  it('records each level once', () => {
    const g = { ...newGame(LEVELS[0].id), won: true };
    expect(recordWin(recordWin([], g), g)).toEqual([LEVELS[0].id]);
    expect(recordWin([], newGame(LEVELS[0].id))).toEqual([]);
  });

  it('goes on to the next level, and from the last to the first', () => {
    expect(nextLevel(LEVELS[0].id)).toBe(LEVELS[1].id);
    expect(nextLevel(LEVELS.at(-1)!.id)).toBe(LEVELS[0].id);
  });

  it('opens a level once the one before it is won', () => {
    const [a, b, c, , e] = LEVELS.map((l) => l.id);
    expect(isOpen(a, [], a)).toBe(true);
    expect(isOpen(c, [], a)).toBe(false);
    expect(isOpen(c, [b], a)).toBe(true);
    expect(isOpen(e, [], e)).toBe(true);
  });

  it('drops a saved game of a level that is gone', () => {
    expect(
      savedGame({ ...newGame(LEVELS[0].id), level: 'gone' })
    ).toBeUndefined();
    expect(savedGame(newGame(LEVELS[1].id))?.level).toBe(LEVELS[1].id);
  });
});
