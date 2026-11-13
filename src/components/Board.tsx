import { SIZES, isFound, type Round } from '../lib/game';
import type { Strings } from '../lib/i18n';

export function Board({
  round,
  showing,
  missed,
  disabled,
  onSquare,
  t,
}: {
  round: Round;
  // Whether the whole pattern is lit now, for the child to remember.
  showing: boolean;
  // The wrong square just tapped, which shakes.
  missed?: number;
  disabled: boolean;
  onSquare: (square: number) => void;
  t: Strings;
}) {
  const size = SIZES[round.level];
  return (
    <div
      className={showing ? 'board board--showing' : 'board'}
      style={{ '--cols': size, '--rows': size } as React.CSSProperties}
    >
      {Array.from({ length: size * size }, (_, i) => {
        const lit = isFound(round, i) || (showing && round.pattern.includes(i));
        return (
          <button
            key={i}
            className={
              'square' +
              (lit ? ' square--lit' : '') +
              (missed === i ? ' square--miss' : '')
            }
            onClick={() => onSquare(i)}
            disabled={disabled}
            aria-label={`${t.square} ${i + 1}`}
            aria-pressed={lit}
          />
        );
      })}
    </div>
  );
}
