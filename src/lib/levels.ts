import { parse } from './skeleton';

// S the skeleton, H its head, . the floor, and things in the house: # a
// crate, p a piano (one at most), c an old clock, k a couch, i a
// candlestick, b a bed the skull rolls under, o a creaky board and d a
// bookcase that swings open while the skeleton stands on the board.
//
// The first room shows how the two move. Then come rooms with beds, rooms
// with bookcases, and rooms with both, each a little longer than the one
// before. levels.test.ts checks every level can be won, that no move ever
// leaves it unwinnable, and that the beds and bookcases are needed.
export const ROOMS = [
  [['.....', '.....', '.....', 'S...H', '.....', '.....', '.....']],
  [
    ['Hb...', 'i....', '..b..', '.S...', '...b.', '.....', '....b'],
    ['S...b', 'b..i.', '.i#..', '.....', '.b...', '.....', '...H.'],
    ['.b...', '.k.bb', '..k..', '...k.', '..cH.', '.i.#.', 'bS..#'],
  ],
  [
    ['.....', '.o.di', '.....', '.S...', '...dc', '..k.H', '.d..d'],
    ['.....', '....o', '..k..', '..i..', '.Si..', '....d', '...kH'],
    ['....d', 'H..dS', 'ddk..', 'c..c.', 'io.k.', '..i..', '.....'],
  ],
  [
    ['.....', '....o', '....S', '.#..#', 'cb...', '.di..', 'H..i.'],
    ['o....', '..b..', '.....', 'i..k.', '.c...', '..i.c', 'HbdS.'],
  ],
];

// The ids start with r, so progress saved for the rooms before beds and
// bookcases isn't taken for these.
export const LEVELS = ROOMS.flat().map((rows, n) => parse(`r${n + 1}`, rows));

export const levelById = (id: string) => LEVELS.find((l) => l.id === id);
