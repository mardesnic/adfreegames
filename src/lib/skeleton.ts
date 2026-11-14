// The skeleton walks the way it is told, and its skull rolls the same way
// up and down but the other way left and right, like a mirror. Furniture
// and the walls of the room stop only the one who walks into them. When
// the two meet, the skull hops back on and the skeleton dances.
//
// Each of the two can do something the other can't. The skull is small, so
// it rolls under a bed where the skeleton can't go. The skeleton is heavy,
// so standing on a creaky board it swings a bookcase open, and the skull
// can roll through while it stays there. The skeleton has hands, so it
// pushes a trunk along, and a trunk left on the board is heavy enough to
// hold the bookcase open too. On a slippery rug whoever steps on it slides
// on until something stops them.

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
export type Tile = 'floor' | 'board' | 'bookcase' | 'rug' | Thing;

export type Level = {
  id: string;
  width: number;
  height: number;
  tiles: Tile[];
  // Where the skeleton, its skull and the trunks start.
  skeleton: number;
  skull: number;
  trunks: number[];
};

// The trunks are kept in order, so the same room is always the same.
export type Pos = { skeleton: number; skull: number; trunks: number[] };

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
  r: 'rug',
  t: 'floor',
};

// A level drawn as rows of text: S the skeleton, H its head, # a crate,
// p a piano, c an old clock, k a couch, i a candlestick, b a bed, o a
// creaky board, d a bookcase that opens, r a slippery rug, t a trunk the
// skeleton pushes, . the floor.
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
    trunks: [...cells].flatMap((c, i) => (c === 't' ? [i] : [])),
  };
}

export const startPos = (level: Level): Pos => ({
  skeleton: level.skeleton,
  skull: level.skull,
  trunks: level.trunks,
});

// The square next to i, or -1 past the wall.
const next = (level: Level, i: number, dx: number, dy: number) => {
  const x = (i % level.width) + dx;
  const y = Math.floor(i / level.width) + dy;
  if (x < 0 || y < 0 || x >= level.width || y >= level.height) return -1;
  return y * level.width + x;
};

// The bookcases stand open while the skeleton, or a trunk, is on a creaky
// board.
export const swungOpen = (level: Level, skeleton: number, trunks: number[]) =>
  level.tiles[skeleton] === 'board' ||
  trunks.some((t) => level.tiles[t] === 'board');

// Where a trunk can be pushed to.
const bare = (t: Tile) => t === 'floor' || t === 'board' || t === 'rug';

// The squares one of them goes through, one a step: a single square, or
// more on a slippery rug.
function walk(
  level: Level,
  from: number,
  dx: number,
  dy: number,
  canGo: (j: number) => boolean
) {
  const path = [from];
  for (let i = from; ;) {
    const j = next(level, i, dx, dy);
    if (j < 0 || !canGo(j)) break;
    path.push((i = j));
    if (level.tiles[i] !== 'rug') break;
  }
  return path;
}

export function move(level: Level, pos: Pos, dir: Dir): Move {
  const [dx, dy] = DIRS[dir];
  let trunks = pos.trunks;
  // The skeleton goes first. It pushes a trunk one square, if the square
  // behind is free, and stops there.
  let pushed = false;
  const bones = walk(level, pos.skeleton, dx, dy, (j) => {
    if (pushed) return false;
    if (trunks.includes(j)) {
      const k = next(level, j, dx, dy);
      if (k < 0 || !bare(level.tiles[k]) || trunks.includes(k)) return false;
      if (k === pos.skull) return false;
      trunks = trunks.map((t) => (t === j ? k : t)).sort((a, b) => a - b);
      pushed = true;
      return true;
    }
    return bare(level.tiles[j]);
  });
  if (pushed) bones.splice(2);
  // So the skull can go through a bookcase the moment it opens, and not
  // once the skeleton steps off.
  const open = swungOpen(level, bones.at(-1)!, trunks);
  const skull = walk(level, pos.skull, -dx, dy, (j) => {
    if (trunks.includes(j)) return false;
    const t = level.tiles[j];
    return bare(t) || t === 'bed' || (t === 'bookcase' && open);
  });
  // Landing on the same square, or passing each other, is meeting, also
  // half way along a slide.
  const at = (path: number[], n: number) => path[Math.min(n, path.length - 1)];
  for (let n = 1; n < Math.max(bones.length, skull.length); n++) {
    const a = at(bones, n);
    const b = at(skull, n);
    if (a === b || (a === at(skull, n - 1) && b === at(bones, n - 1)))
      return {
        pos: { skeleton: a, skull: b, trunks },
        stuck: { skeleton: false, skull: false },
        won: true,
      };
  }
  return {
    pos: { skeleton: bones.at(-1)!, skull: skull.at(-1)!, trunks },
    stuck: {
      skeleton: bones.length === 1,
      skull: skull.length === 1,
    },
    won: false,
  };
}

const key = (p: Pos) => `${p.skeleton},${p.skull},${p.trunks.join('.')}`;

// The fewest moves to win from each place the two can get to.
export function distances(level: Level): Map<string, number> {
  const start = startPos(level);
  const seen = new Map<string, Pos>([[key(start), start]]);
  const back = new Map<string, string[]>();
  const dist = new Map<string, number>();
  const near: string[] = [];
  const queue = [start];
  for (let q = 0; q < queue.length; q++) {
    const p = queue[q];
    const k = key(p);
    dist.set(k, Infinity);
    for (const dir of Object.keys(DIRS) as Dir[]) {
      const m = move(level, p, dir);
      if (m.won) {
        near.push(k);
        continue;
      }
      const o = key(m.pos);
      if (!back.has(o)) back.set(o, []);
      back.get(o)!.push(k);
      if (!seen.has(o)) {
        seen.set(o, m.pos);
        queue.push(m.pos);
      }
    }
  }
  // Walk back from the places one move from winning.
  const todo: string[] = [];
  for (const k of near)
    if (dist.get(k) === Infinity) {
      dist.set(k, 1);
      todo.push(k);
    }
  for (let q = 0; q < todo.length; q++) {
    const d = dist.get(todo[q])! + 1;
    for (const k of back.get(todo[q]) ?? [])
      if (dist.get(k) === Infinity) {
        dist.set(k, d);
        todo.push(k);
      }
  }
  return dist;
}

// The fewest moves to win, Infinity if it can't be won.
export const shortest = (level: Level) =>
  distances(level).get(key(startPos(level)))!;

// Whether every place the two can walk to can still be won from, so a
// child can never get stuck.
export const noDeadEnds = (level: Level) =>
  [...distances(level).values()].every((d) => d !== Infinity);
