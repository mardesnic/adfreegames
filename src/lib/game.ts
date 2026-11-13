// Cards lie face down, two of each picture. The child turns over two at a
// time; a pair stays face up, two different pictures turn back over.

export const LEVELS = ['easy', 'medium', 'hard'] as const;
export type Level = (typeof LEVELS)[number];

// The board of each level, as columns × rows.
export const SIZES: Record<Level, [number, number]> = {
  easy: [3, 4],
  medium: [4, 5],
  hard: [5, 6],
};

export const pairsOf = (level: Level) =>
  (SIZES[level][0] * SIZES[level][1]) / 2;

// Pictures easy to tell apart and to name, from all sorts of things. No two
// look alike (no lion and tiger, no cherry and strawberry).
// prettier-ignore
export const PICTURES = [
  '🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐼', '🐸', '🐵', '🐷',
  '🐮', '🦁', '🐔', '🐧', '🦉', '🐢', '🐙', '🦋', '🐝', '🐞',
  '🐟', '🐳', '🦒', '🐘', '🍎', '🍌', '🍇', '🍓', '🍉', '🍍',
  '🥕', '🌽', '🍄', '🚗', '🚀', '🚂', '🚲', '⛵', '🚁', '🚜',
  '⚽', '🎈', '🎁', '⭐', '🌈', '🌙', '🔥', '🌻', '🌵', '🎸',
  '🥁', '👑', '🍦', '🍕', '🎂', '🧸',
];

export type Round = {
  level: Level;
  // The picture on each card, row by row.
  cards: string[];
  // The cards already paired up, which stay face up.
  found: number[];
  // The cards turned over now: one, or two that are not a pair and will
  // turn back over.
  open: number[];
};

export const isSolved = (round: Round) =>
  round.found.length === round.cards.length;

export const isFaceUp = (round: Round, card: number) =>
  round.found.includes(card) || round.open.includes(card);

// Turns over `card`. Two cards that are not a pair are turned back first,
// and if `card` is one of them, it stays up.
export function flip(round: Round, card: number): Round {
  if (round.open.length === 2 && round.open.includes(card))
    return { ...round, open: [card] };
  if (!(card in round.cards) || isSolved(round) || isFaceUp(round, card))
    return round;
  const [first] = round.open;
  if (round.open.length !== 1) return { ...round, open: [card] };
  if (round.cards[first] === round.cards[card])
    return { ...round, found: [...round.found, first, card], open: [] };
  return { ...round, open: [first, card] };
}

// Whether two cards are showing that are not a pair.
export const isMiss = (round: Round) => round.open.length === 2;

// Turns two cards that are not a pair back over.
export const hide = (round: Round): Round =>
  isMiss(round) ? { ...round, open: [] } : round;

function shuffle<T>(items: T[], random: () => number) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A new game for the level, with other pictures than `last` where it can.
export function newRound(
  level: Level,
  random = Math.random,
  last?: Round
): Round {
  const used = new Set(last?.cards);
  const pictures = shuffle(PICTURES, random);
  const fresh = [
    ...pictures.filter((p) => !used.has(p)),
    ...pictures.filter((p) => used.has(p)),
  ].slice(0, pairsOf(level));
  return {
    level,
    cards: shuffle([...fresh, ...fresh], random),
    found: [],
    open: [],
  };
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
