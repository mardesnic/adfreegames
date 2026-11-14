import { isOpen, type Progress } from '../lib/game';
import type { Strings } from '../lib/i18n';
import { LEVELS } from '../lib/levels';

export function Levels({
  current,
  progress,
  onPick,
  t,
}: {
  current: string;
  progress: Progress;
  onPick: (id: string) => void;
  t: Strings;
}) {
  return (
    <section className='card'>
      <h2>{t.levels}</h2>
      <div className='levels'>
        {LEVELS.map((level, k) => {
          const n = k + 1;
          const won = progress.includes(level.id);
          // In dev every level is open, to try any of them.
          const open =
            import.meta.env.DEV || isOpen(level.id, progress, current);
          return (
            <button
              key={level.id}
              className={[
                'level',
                won && 'level--won',
                level.id === current && 'level--current',
                !open && 'level--locked',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onPick(level.id)}
              disabled={!open}
              aria-label={
                won
                  ? `${t.level(n)}, ${t.won}`
                  : open
                    ? t.level(n)
                    : `${t.level(n)}, ${t.locked}`
              }
            >
              {n}
            </button>
          );
        })}
      </div>
    </section>
  );
}
