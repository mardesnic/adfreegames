import { parse } from './skeleton';

// S the skeleton, H its head, # a crate, o a pumpkin. From the easiest:
// first they only walk towards each other, then a wall or a crate holds
// one of them still while the other catches up. levels.test.ts checks
// every level can be won, and that no move ever leaves it unwinnable.
const ROWS = [
  ['.....', '.....', '.....', 'S...H', '.....', '.....', '.....'],
  ['.....', '.....', '.H...', '.....', '.....', '.....', '...S.'],
  ['.....', '.#...', '.S#..', '.....', '..#H.', '...#.', '.....'],
  ['.....', '.S...', '.....', '..#..', '.....', '...H.', '.....'],
  ['..o.H', '#.o..', '.....', '.....', 'S....', '.....', '.....'],
  ['....H', '.....', '.o...', '.....', '#....', '.....', 'So...'],
  ['H.#..', '..#..', '..#..', '.....', '..#..', '..#..', '..#.S'],
  ['.....', '..#..', '.....', '..o.H', '...o.', '....#', '#...S'],
];

export const LEVELS = ROWS.map((rows, n) => parse(String(n + 1), rows));

export const levelById = (id: string) => LEVELS.find((l) => l.id === id);
