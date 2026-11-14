import { LEVELS, levelById } from './levels';
import { move, type Dir, type Move, type Pos } from './skeleton';

// The level being played and where the two are.
export type Game = { level: string; pos: Pos; won: boolean };

// The ids of the levels won so far.
export type Progress = string[];

export function newGame(id: string): Game {
  const l = levelById(id) ?? LEVELS[0];
  return {
    level: l.id,
    pos: { skeleton: l.skeleton, skull: l.skull },
    won: false,
  };
}

// A saved game of a level since taken out starts afresh.
export const savedGame = (g: Game | undefined) =>
  g && levelById(g.level) && g.pos ? g : undefined;

export function play(game: Game, dir: Dir): { game: Game; move?: Move } {
  if (game.won) return { game };
  const m = move(levelById(game.level)!, game.pos, dir);
  return { game: { ...game, pos: m.pos, won: m.won }, move: m };
}

export const recordWin = (progress: Progress, game: Game): Progress =>
  game.won && !progress.includes(game.level)
    ? [...progress, game.level]
    : progress;

// The level after this one; the last is followed by the first.
export const nextLevel = (id: string) =>
  LEVELS[(LEVELS.findIndex((l) => l.id === id) + 1) % LEVELS.length].id;
