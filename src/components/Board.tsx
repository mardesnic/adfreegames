import { useRef, type CSSProperties } from 'react';

import type { Strings } from '../lib/i18n';
import type { Dir, Level, Pos } from '../lib/skeleton';
import { LooseSkull, SkeletonArt, ThingArt, Web } from './Art';

// A drag shorter than this is a tap, and does nothing.
const SWIPE = 24;

export type Who = 'skeleton' | 'skull';

// Who walked into something, counted so each bump shakes again.
export type Bump = { skeleton: boolean; skull: boolean; n: number };

export function Board({
  level,
  pos,
  won,
  bump,
  onSwipe,
  onDanced,
  t,
}: {
  level: Level;
  pos: Pos;
  won: boolean;
  bump?: Bump;
  // A swipe moves whichever of the two it starts nearer to.
  onSwipe: (who: Who, dir: Dir) => void;
  // The skull is back on and the dance is over.
  onDanced: () => void;
  t: Strings;
}) {
  const down = useRef<{ x: number; y: number; who: Who } | null>(null);

  const nearer = (e: React.PointerEvent): Who => {
    const box = e.currentTarget.getBoundingClientRect();
    const unit = box.width / level.width;
    const x = (e.clientX - box.left) / unit - 0.5;
    const y = (e.clientY - box.top) / unit - 0.5;
    const away = (i: number) =>
      Math.hypot((i % level.width) - x, Math.floor(i / level.width) - y);
    return away(pos.skull) < away(pos.skeleton) ? 'skull' : 'skeleton';
  };

  const onDown = (e: React.PointerEvent) => {
    if (won || !e.isPrimary) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    down.current = { x: e.clientX, y: e.clientY, who: nearer(e) };
  };

  const onUp = (e: React.PointerEvent) => {
    const start = down.current;
    down.current = null;
    if (!start || !e.isPrimary) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.hypot(dx, dy) < SWIPE) return;
    if (Math.abs(dx) > Math.abs(dy))
      onSwipe(start.who, dx < 0 ? 'left' : 'right');
    else onSwipe(start.who, dy < 0 ? 'up' : 'down');
  };

  const place = (i: number) =>
    ({
      '--x': i % level.width,
      '--y': Math.floor(i / level.width),
    }) as CSSProperties;

  const shake = (who: Who) =>
    bump?.[who] ? `sprite__body sprite__body--stuck` : 'sprite__body';

  return (
    <div
      className={won ? 'board board--won' : 'board'}
      style={{ '--w': level.width, '--h': level.height } as CSSProperties}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={() => (down.current = null)}
    >
      <div className='tiles'>
        {level.tiles.map((tile, i) => (
          <span
            key={i}
            className={`tile tile--${tile}`}
            role={tile === 'floor' ? undefined : 'img'}
            aria-label={tile === 'floor' ? undefined : t.tiles[tile]}
          >
            {tile !== 'floor' && <ThingArt thing={tile} />}
          </span>
        ))}
      </div>
      <Web />

      <span
        className='sprite sprite--skull'
        // Once they meet, the skull hops onto the skeleton's neck.
        style={place(won ? pos.skeleton : pos.skull)}
        role='img'
        aria-label={t.skull}
      >
        <span key={bump?.skull ? bump.n : 0} className={shake('skull')}>
          <LooseSkull />
        </span>
      </span>
      <span
        className='sprite sprite--skeleton'
        style={place(pos.skeleton)}
        role='img'
        aria-label={t.skeleton}
      >
        <span
          key={bump?.skeleton ? bump.n : 0}
          className={shake('skeleton')}
          onAnimationEnd={(e) => {
            if (e.animationName === 'dance') onDanced();
          }}
        >
          <SkeletonArt head={won} />
        </span>
      </span>
    </div>
  );
}
