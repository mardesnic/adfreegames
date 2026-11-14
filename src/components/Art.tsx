import type { Tile } from '../lib/skeleton';

// The pictures, drawn on a 100 × 100 square.

// The skeleton, with no head until the skull hops back on. Its arms and
// legs are groups of their own, so they can dance.
export function SkeletonArt({ head }: { head: boolean }) {
  return (
    <svg className='art' viewBox='0 0 100 100' aria-hidden='true'>
      <g className='bone'>
        <g className='leg leg--left'>
          <path d='M44 72 40 94' />
          <path d='M40 94h-8' />
        </g>
        <g className='leg leg--right'>
          <path d='M56 72 60 94' />
          <path d='M60 94h8' />
        </g>
        <g className='arm arm--left'>
          <path d='M38 42 26 58 22 70' />
          <circle cx='21' cy='73' r='3.5' />
        </g>
        <g className='arm arm--right'>
          <path d='M62 42 74 58 78 70' />
          <circle cx='79' cy='73' r='3.5' />
        </g>
        <path d='M50 31v37' />
        <path d='M37 42h26M39 50h22M41 58h18' />
        <path className='bone__fill' d='M40 66h20l-4 8h-12z' />
      </g>
      {head && (
        // Smaller and higher than the skull alone, so the neck shows.
        <g transform='translate(10 -6) scale(0.8)'>
          <SkullArt className='head' />
        </g>
      )}
    </svg>
  );
}

export function SkullArt({ className }: { className?: string }) {
  return (
    <g className={className}>
      <path
        className='skull'
        d='M50 6c-13 0-22 9-22 20 0 6 3 10 7 13v6h30v-6c4-3 7-7 7-13 0-11-9-20-22-20Z'
      />
      <ellipse className='skull__eye' cx='41.5' cy='26' rx='5' ry='5.5' />
      <ellipse className='skull__eye' cx='58.5' cy='26' rx='5' ry='5.5' />
      <path className='skull__eye' d='M50 31l-3 5h6z' />
      <path className='skull__teeth' d='M41 39v6M47 39v6M53 39v6M59 39v6' />
    </g>
  );
}

// The skull alone, as big as fits its square.
export function LooseSkull() {
  return (
    <svg className='art' viewBox='22 2 56 48' aria-hidden='true'>
      <SkullArt />
    </svg>
  );
}

function Crate() {
  return (
    <>
      <rect className='wood' x='12' y='14' width='76' height='74' rx='6' />
      <path className='crate__plank' d='M12 14 88 88M88 14 12 88' />
      <rect className='wood-edge' x='12' y='14' width='76' height='74' rx='6' />
    </>
  );
}

// An upright piano, with its keys and a sheet of music.
function Piano() {
  return (
    <>
      <rect className='piano' x='8' y='16' width='84' height='74' rx='5' />
      <rect className='paper' x='36' y='22' width='28' height='16' rx='2' />
      <path className='piano__notes' d='M42 34v-8l8-2v8' />
      <rect className='paper' x='8' y='46' width='84' height='14' />
      <path
        className='piano__black'
        d='M18 46v8M28 46v8M44 46v8M54 46v8M64 46v8M80 46v8'
      />
      <path className='piano__leg' d='M16 60v30M84 60v30' />
    </>
  );
}

// A tall old clock, stopped at a quarter past.
function Clock() {
  return (
    <>
      <path className='wood' d='M30 10h40v14l-4 4v58H34V28l-4-4Z' />
      <circle className='paper' cx='50' cy='26' r='12' />
      <path className='clock__hands' d='M50 26v-8M50 26h6' />
      <rect
        className='clock__window'
        x='40'
        y='44'
        width='20'
        height='34'
        rx='10'
      />
      <path className='clock__pendulum' d='M50 44v22' />
      <circle className='brass' cx='50' cy='68' r='5' />
      <path className='wood-edge' d='M30 10h40v14l-4 4v58H34V28l-4-4Z' />
    </>
  );
}

// A velvet couch.
function Couch() {
  return (
    <>
      <path className='couch' d='M20 30c0-8 6-12 30-12s30 4 30 12v24H20Z' />
      <rect
        className='couch__seat'
        x='18'
        y='52'
        width='64'
        height='18'
        rx='5'
      />
      <rect className='couch' x='6' y='42' width='18' height='34' rx='8' />
      <rect className='couch' x='76' y='42' width='18' height='34' rx='8' />
      <path className='couch__leg' d='M14 76v8M86 76v8' />
      <circle className='brass' cx='35' cy='36' r='2.5' />
      <circle className='brass' cx='50' cy='34' r='2.5' />
      <circle className='brass' cx='65' cy='36' r='2.5' />
    </>
  );
}

// A brass candlestick with three lit candles.
function Candles() {
  return (
    <>
      <circle className='candles__glow' cx='50' cy='30' r='36' />
      <path
        className='candles__arm'
        d='M28 42v6c0 10 44 10 44 0v-6M50 42v42M36 88h28'
      />
      <rect className='paper' x='23' y='26' width='10' height='18' rx='2' />
      <rect className='paper' x='45' y='20' width='10' height='24' rx='2' />
      <rect className='paper' x='67' y='26' width='10' height='18' rx='2' />
      <path
        className='candles__flame'
        d='M28 14c-4 5-4 9 0 10 4-1 4-5 0-10ZM50 8c-4 5-4 9 0 10 4-1 4-5 0-10ZM72 14c-4 5-4 9 0 10 4-1 4-5 0-10Z'
      />
    </>
  );
}

// An old bed, high on its legs, with room under it for the skull.
function Bed() {
  return (
    <>
      <path className='bed__under' d='M10 58h80v34H10Z' />
      <rect className='wood' x='6' y='10' width='16' height='82' rx='4' />
      <rect className='wood' x='78' y='26' width='16' height='66' rx='4' />
      <rect className='paper' x='20' y='30' width='60' height='16' rx='4' />
      <path className='bed__blanket' d='M20 38h60v18q-30 6-60 0Z' />
      <rect className='wood' x='18' y='52' width='64' height='8' rx='2' />
    </>
  );
}

// A floorboard that creaks, lighter than the rest, with its nails showing.
// The skeleton's weight pushes it down.
function Board() {
  return (
    <>
      <rect className='floorboard' x='4' y='30' width='92' height='40' rx='3' />
      <path className='floorboard__crack' d='M20 40q10 6 22 2t26 6' />
      <circle className='floorboard__nail' cx='12' cy='50' r='3' />
      <circle className='floorboard__nail' cx='88' cy='50' r='3' />
      <path className='floorboard__creak' d='M30 22l-4-8M50 20v-10M70 22l4-8' />
    </>
  );
}

// A bookcase full of books. Open, it has swung round, and shows the dark
// passage behind it.
function Bookcase({ open }: { open: boolean }) {
  if (open)
    return (
      <>
        <rect className='passage' x='6' y='4' width='88' height='92' rx='4' />
        <path className='wood' d='M78 4h16v92H78Z' />
        <path className='wood-edge' d='M78 4h16v92H78Z' />
      </>
    );
  return (
    <>
      <rect className='wood' x='6' y='4' width='88' height='92' rx='4' />
      <path
        className='bookcase__shelf'
        d='M14 12h72v24H14ZM14 42h72v24H14ZM14 72h72v20H14Z'
      />
      <path
        className='book book--a'
        d='M16 16h8v20h-8ZM40 20h7v16h-7ZM62 14h8v22h-8ZM32 46h8v20h-8ZM56 48h7v18h-7ZM20 74h8v18h-8ZM64 76h8v16h-8Z'
      />
      <path
        className='book book--b'
        d='M25 18h7v18h-7ZM50 16h9v20h-9ZM16 48h8v18h-8ZM44 44h9v22h-9ZM70 46h8v20h-8ZM40 76h9v16h-9Z'
      />
      <rect className='wood-edge' x='6' y='4' width='88' height='92' rx='4' />
    </>
  );
}

const THING_ART = {
  crate: Crate,
  piano: Piano,
  clock: Clock,
  couch: Couch,
  candles: Candles,
  bed: Bed,
  board: Board,
};

export function TileArt({
  tile,
  open,
}: {
  tile: Exclude<Tile, 'floor'>;
  open: boolean;
}) {
  return (
    <svg className='art' viewBox='0 0 100 100' aria-hidden='true'>
      {tile === 'bookcase' ? <Bookcase open={open} /> : <ThingOf tile={tile} />}
    </svg>
  );
}

function ThingOf({ tile }: { tile: keyof typeof THING_ART }) {
  const Art = THING_ART[tile];
  return <Art />;
}

// A spider web in the top corner of the room.
export function Web() {
  return (
    <svg className='web' viewBox='0 0 100 100' aria-hidden='true'>
      <path d='M0 0 100 0M0 0 92 40M0 0 60 75M0 0 22 100M0 0 0 100' />
      <path d='M30 0q2 8 -2 13q-4 6 -8 12q-6 4 -13 2q-4 -4 -7 0' />
      <path d='M60 0q2 16 -4 26q-8 10 -16 22q-12 6 -26 4q-8 -4 -14 0' />
      <path d='M88 0q2 22 -6 38q-12 16 -24 32q-18 10 -38 6q-10 -2 -20 4' />
    </svg>
  );
}
