// A few squares of a grid light up for a moment. The child taps the same
// squares from memory. A wrong square clears what was tapped and shows the
// pattern again, to start over.

export const LEVELS = ['easy', 'medium', 'hard'] as const;
export type Level = (typeof LEVELS)[number];

// The grid of each level is this many squares across and down.
export const SIZES: Record<Level, number> = { easy: 3, medium: 4, hard: 5 };

// How many squares light up.
export const LIT: Record<Level, number> = { easy: 3, medium: 5, hard: 7 };

// How long the pattern shows, in milliseconds: longer for more squares.
export const showTime = (level: Level) => 800 + 150 * LIT[level];

export type Round = {
  level: Level;
  // The squares that light up, row by row from the top left, in order.
  pattern: number[];
  // The squares of the pattern already tapped.
  found: number[];
};

export const isSolved = (round: Round) =>
  round.found.length === round.pattern.length;

export const isFound = (round: Round, square: number) =>
  round.found.includes(square);

// Whether tapping `square` is wrong: it is not in the pattern.
export const isMiss = (round: Round, square: number) =>
  !isSolved(round) &&
  square >= 0 &&
  square < SIZES[round.level] ** 2 &&
  !round.pattern.includes(square);

export function tap(round: Round, square: number): Round {
  if (
    isSolved(round) ||
    !round.pattern.includes(square) ||
    isFound(round, square)
  )
    return round;
  return { ...round, found: [...round.found, square] };
}

// After a wrong square: none of the pattern tapped yet.
export const restart = (round: Round): Round =>
  isSolved(round) ? round : { ...round, found: [] };

const samePattern = (a: number[], b: number[]) => a.join() === b.join();

// A new game for the level, not the same pattern as `last`.
export function newRound(
  level: Level,
  random = Math.random,
  last?: Round
): Round {
  const squares = SIZES[level] ** 2;
  for (;;) {
    const all = Array.from({ length: squares }, (_, i) => i);
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    const pattern = all.slice(0, LIT[level]).sort((a, b) => a - b);
    if (last && last.level === level && samePattern(last.pattern, pattern))
      continue;
    return { level, pattern, found: [] };
  }
}

export type Store = { round?: Round };

export const initialStore: Store = {};

export type Stats = { [L in Level]: { solved: number } };

export const initialStats = Object.fromEntries(
  LEVELS.map((l) => [l, { solved: 0 }])
) as Stats;

export const recordWin = (stats: Stats, round: Round): Stats =>
  isSolved(round)
    ? {
        ...stats,
        [round.level]: { solved: (stats[round.level]?.solved ?? 0) + 1 },
      }
    : stats;
