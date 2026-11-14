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
        <path d='M50 34v34' />
        <path d='M37 42h26M39 50h22M41 58h18' />
        <path className='bone__fill' d='M40 66h20l-4 8h-12z' />
      </g>
      {head && <SkullArt className='head' />}
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

export function CrateArt() {
  return (
    <svg className='art' viewBox='0 0 100 100' aria-hidden='true'>
      <rect className='crate' x='12' y='12' width='76' height='76' rx='6' />
      <path className='crate__plank' d='M12 12 88 88M88 12 12 88' />
      <rect
        className='crate__edge'
        x='12'
        y='12'
        width='76'
        height='76'
        rx='6'
      />
    </svg>
  );
}

// A friendly carved pumpkin.
export function PumpkinArt() {
  return (
    <svg className='art' viewBox='0 0 100 100' aria-hidden='true'>
      <path className='pumpkin__stem' d='M50 28c0-8 3-12 9-14' />
      <ellipse className='pumpkin' cx='50' cy='60' rx='36' ry='30' />
      <path
        className='pumpkin__rib'
        d='M50 31c-10 8-10 50 0 58M50 31c10 8 10 50 0 58'
      />
      <path className='pumpkin__face' d='M33 52l6-8 6 8zM55 52l6-8 6 8z' />
      <path
        className='pumpkin__face'
        d='M34 66c8 9 24 9 32 0l-6 2-4 4-4-4-4 4-4-4-4 4-4-4z'
      />
    </svg>
  );
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
