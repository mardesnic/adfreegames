import { parse } from './skeleton';

// S the skeleton, H its head, . the floor, and things in the house: # a
// crate, p a piano (one at most), c an old clock, k a couch, i a
// candlestick. From the easiest: first they only walk towards each other,
// then a wall or a thing holds one of them still while the other catches
// up. levels.test.ts checks every level can be won, and that no move ever
// leaves it unwinnable.
const ROWS = [
  ['.....', '.....', '.....', 'S...H', '.....', '.....', '.....'],
  ['.....', '.....', '.H...', '.....', '.....', '.....', '...S.'],
  ['.....', '.c...', '.Sk..', '.....', '..iH.', '...#.', '.....'],
  ['.....', '.S...', '.....', '..p..', '.....', '...H.', '.....'],
  ['..i.H', 'k.c..', '.....', '.....', 'S....', '.....', '.....'],
  ['....H', '.....', '.p...', '.....', 'c....', '.....', 'Si...'],
  ['H.c..', '..#..', '..k..', '.....', '..#..', '..i..', '..p.S'],
  ['.....', '..c..', '.....', '..i.H', '...k.', '....#', 'p...S'],
];

export const LEVELS = ROWS.map((rows, n) => parse(String(n + 1), rows));

export const levelById = (id: string) => LEVELS.find((l) => l.id === id);
