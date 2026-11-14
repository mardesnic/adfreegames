import { parse } from './skeleton';

// S the skeleton, H its head, . the floor, and things in the house: # a
// crate, p a piano (one at most), c an old clock, k a couch, i a
// candlestick. The first level shows how they move; from the second on,
// walls and things must hold one of them still while the other catches up,
// a little longer each time. levels.test.ts checks every level can be won,
// and that no move ever leaves it unwinnable.
const ROWS = [
  ['.....', '.....', '.....', 'S...H', '.....', '.....', '.....'],
  ['.....', '..c..', '.....', '..i.H', '...k.', '....#', 'p...S'],
  ['ci...', '...iH', '#....', '..i.c', '...k.', '.....', '...cS'],
  ['.....', '..c..', '.k...', '..i.H', '...k#', '....#', 'p...S'],
  ['#....', '.k..H', '....c', '.....', '.i#ci', '.c...', '...iS'],
  ['.....', '..p.k', '.k..k', '..i.H', '...k.', 'c...#', '#...S'],
  ['.S...', '.kii.', 'c....', '...i.', '.kck.', '....c', '....H'],
  ['.....', '.i...', '..k#H', 'k.iSc', '..#..', '.#...', '.....'],
];

// The ids start with h, so progress saved for the first, easier levels
// isn't taken for these.
export const LEVELS = ROWS.map((rows, n) => parse(`h${n + 1}`, rows));

export const levelById = (id: string) => LEVELS.find((l) => l.id === id);
