import { parse } from './skeleton';

// S the skeleton, H its head, . the floor, and things in the house: # a
// crate, p a piano (one at most), c an old clock, k a couch, i a
// candlestick, b a bed the skull rolls under, o a creaky board and d a
// bookcase that swings open while the skeleton (or a trunk) stands on the
// board, t a trunk the skeleton pushes, r a slippery rug.
//
// Each list is a kind of room, a little longer each time. They are kept in
// the order they were made, which gives each level its id, and played in
// ORDER below. levels.test.ts checks every level can be won, that no move
// ever leaves it unwinnable, and that the new things are needed.
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
  [
    ['S..t.', '..cH.', '...#k', '.....', '.c...', '.....', '.k.k.'],
    ['S....', 't...c', '.kk..', '..k.k', '.H.k.', 'c....', '.....'],
    ['...t.', '.S...', 'ci...', '.Hc..', '...i.', '..#..', '...t.'],
  ],
  [
    ['.t...', 'oc.i.', 't....', '...i.', '.S...', '...dk', 'k..dH'],
    ['dHk..', '.id..', '.S.io', '....t', 'c....', 't....', '....i'],
    ['i.Hk.', 'd.i.o', '.i.t.', 'Si..d', '..#..', '....#', '.i...'],
  ],
  [
    ['kr..k', '...k.', '.rr..', 'k.H#S', '.c..#', '....i', '..i..'],
    ['..#.c', '.k.H.', 'r..#.', '.i..#', '.S#..', '.rc.#', '.....'],
    ['.....', '.....', '.S.#i', 'cr#H.', 'krr#.', 'cr..r', '..#..'],
  ],
];

// The ids start with r, so progress saved for the rooms before beds and
// bookcases isn't taken for these.
const ids = ROOMS.map((room, k) => {
  const before = ROOMS.slice(0, k).flat().length;
  return room.map((_, n) => `r${before + n + 1}`);
});

const byId = new Map(
  ROOMS.flatMap((room, k) => room.map((rows, n) => [ids[k][n], rows]))
);

// The first room shows how the two move, then come beds, trunks, rugs,
// trunks with bookcases, and last the hardest: bookcases held open by the
// skeleton alone, and those with beds. The second trunk level plays first,
// as it is easier to start trunks with, and so does the second bookcase
// level.
const ORDER = [
  ['r1'],
  ['r2', 'r3', 'r4'],
  ['r11', 'r10', 'r12'],
  ['r16', 'r17', 'r18'],
  ['r13', 'r14', 'r15'],
  ['r6', 'r5', 'r7'],
  ['r8', 'r9'],
].flat();

export const LEVELS = ORDER.map((id) => parse(id, byId.get(id)!));

export const levelById = (id: string) => LEVELS.find((l) => l.id === id);
