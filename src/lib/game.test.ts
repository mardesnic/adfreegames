import { describe, expect, it } from 'vitest';

import { newGame, nextLevel, play, recordWin, savedGame } from './game';
import { LEVELS } from './levels';

describe('game', () => {
  it('wins the first level by walking right twice', () => {
    let g = newGame('1');
    g = play(g, 'right').game;
    expect(g.won).toBe(false);
    g = play(g, 'right').game;
    expect(g.won).toBe(true);
    expect(play(g, 'left').game).toBe(g);
  });

  it('records each level once', () => {
    const g = { ...newGame('1'), won: true };
    expect(recordWin(recordWin([], g), g)).toEqual(['1']);
    expect(recordWin([], newGame('1'))).toEqual([]);
  });

  it('goes on to the next level, and from the last to the first', () => {
    expect(nextLevel('1')).toBe('2');
    expect(nextLevel(LEVELS.at(-1)!.id)).toBe('1');
  });

  it('drops a saved game of a level that is gone', () => {
    expect(savedGame({ ...newGame('1'), level: 'gone' })).toBeUndefined();
    expect(savedGame(newGame('2'))?.level).toBe('2');
  });
});
