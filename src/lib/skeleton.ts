// The skeleton walks the way it is told, and its skull rolls the same way
// up and down but the other way left and right, like a mirror. Furniture
// and the walls of the room stop only the one who walks into them. When
// the two meet, the skull hops back on and the skeleton dances.
//
// Each of the two can do something the other can't. The skull is small, so
// it rolls under a bed where the skeleton can't go. The skeleton is heavy,
// so standing on a creaky board it swings a bookcase open, and the skull
// can roll through while it stays there.

// Things in the house that stop whoever walks into them, but a bed lets
// the skull roll under.
export const THINGS = [
  'crate',
  'piano',
  'clock',
  'couch',
  'candles',
  'bed',
] as const;
export type Thing = (typeof THINGS)[number];
export type Tile = 'floor' | 'board' | 'bookcase' | Thing;

export type Level = {
  id: string;
  width: number;
  height: number;
  tiles: Tile[];
  // Where the skeleton and its skull start.
  skeleton: number;
  skull: number;
};

export type Pos = { skeleton: number; skull: number };

export type Move = {
  pos: Pos;
  // Who walked into something and stayed where they were.
  stuck: { skeleton: boolean; skull: boolean };
  won: boolean;
};

export const DIRS = {
  left: [-1, 0],
  up: [0, -1],
  down: [0, 1],
  right: [1, 0],
} as const;

export type Dir = keyof typeof DIRS;

// The way the other one goes: left and right swap, up and down stay.
export const mirror = (dir: Dir): Dir =>
  dir === 'left' ? 'right' : dir === 'right' ? 'left' : dir;

const TILES: Record<string, Tile> = {
  '.': 'floor',
  S: 'floor',
  H: 'floor',
  '#': 'crate',
  p: 'piano',
  c: 'clock',
  k: 'couch',
  i: 'candles',
  b: 'bed',
  o: 'board',
  d: 'bookcase',
};

// A level drawn as rows of text: S the skeleton, H its head, # a crate,
// p a piano, c an old clock, k a couch, i a candlestick, b a bed, o a
// creaky board, d a bookcase that opens, . the floor.
export function parse(id: string, rows: string[]): Level {
  const width = rows[0].length;
  const cells = rows.join('');
  if (rows.some((r) => r.length !== width)) throw new Error(`${id}: ragged`);
  return {
    id,
    width,
    height: rows.length,
    tiles: [...cells].map((c) => {
      const t = TILES[c];
      if (!t) throw new Error(`${id}: unknown '${c}'`);
      return t;
    }),
    skeleton: cells.indexOf('S'),
    skull: cells.indexOf('H'),
  };
}

const step = (
  level: Level,
  i: number,
  dx: number,
  dy: number,
  canGo: (t: Tile) => boolean
) => {
  const x = (i % level.width) + dx;
  const y = Math.floor(i / level.width) + dy;
  if (x < 0 || y < 0 || x >= level.width || y >= level.height) return i;
  const j = y * level.width + x;
  return canGo(level.tiles[j]) ? j : i;
};

// The bookcases stand open while the skeleton is on a creaky board.
export const swungOpen = (level: Level, skeleton: number) =>
  level.tiles[skeleton] === 'board';

export function move(level: Level, pos: Pos, dir: Dir): Move {
  const [dx, dy] = DIRS[dir];
  const skeleton = step(
    level,
    pos.skeleton,
    dx,
    dy,
    (t) => t === 'floor' || t === 'board'
  );
  // The skeleton steps first, so the skull can go through a bookcase the
  // moment it opens, and not once the skeleton steps off.
  const open = swungOpen(level, skeleton);
  const skull = step(
    level,
    pos.skull,
    -dx,
    dy,
    (t) =>
      t === 'floor' ||
      t === 'board' ||
      t === 'bed' ||
      (t === 'bookcase' && open)
  );
  // Landing on the same square, or passing each other, is meeting.
  const won =
    skeleton === skull || (skeleton === pos.skull && skull === pos.skeleton);
  return {
    pos: { skeleton, skull },
    stuck: {
      skeleton: skeleton === pos.skeleton,
      skull: skull === pos.skull,
    },
    won,
  };
}

const key = (p: Pos) => p.skeleton * 1000 + p.skull;

// The fewest moves to win from each place the two can get to.
export function distances(level: Level): Map<number, number> {
  const start: Pos = { skeleton: level.skeleton, skull: level.skull };
  const seen = new Map<number, Pos>([[key(start), start]]);
  const edges = new Map<number, number[]>();
  const won = new Set<number>();
  const queue = [start];
  while (queue.length) {
    const p = queue.shift()!;
    const out: number[] = [];
    for (const dir of Object.keys(DIRS) as Dir[]) {
      const m = move(level, p, dir);
      if (m.won) {
        won.add(key(p));
        continue;
      }
      const k = key(m.pos);
      out.push(k);
      if (!seen.has(k)) {
        seen.set(k, m.pos);
        queue.push(m.pos);
      }
    }
    edges.set(key(p), out);
  }
  // Walk back from the places one move from winning.
  const dist = new Map<number, number>(
    [...seen.keys()].map((k) => [k, Infinity])
  );
  for (let changed = true; changed;) {
    changed = false;
    for (const [k, out] of edges) {
      const d = won.has(k)
        ? 1
        : 1 + Math.min(Infinity, ...out.map((o) => dist.get(o)!));
      if (d < dist.get(k)!) {
        dist.set(k, d);
        changed = true;
      }
    }
  }
  return dist;
}

// The fewest moves to win, Infinity if it can't be won.
export const shortest = (level: Level) =>
  distances(level).get(key({ skeleton: level.skeleton, skull: level.skull }))!;

// Whether every place the two can walk to can still be won from, so a
// child can never get stuck.
export const noDeadEnds = (level: Level) =>
  [...distances(level).values()].every((d) => d !== Infinity);
