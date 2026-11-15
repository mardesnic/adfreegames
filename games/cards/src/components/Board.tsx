import { SIZES, isFaceUp, type Round } from '../lib/game';
import type { Strings } from '../lib/i18n';

export function Board({
  round,
  onCard,
  t,
}: {
  round: Round;
  onCard: (card: number) => void;
  t: Strings;
}) {
  const [cols, rows] = SIZES[round.level];
  return (
    <div
      className='board'
      style={{ '--cols': cols, '--rows': rows } as React.CSSProperties}
    >
      {round.cards.map((picture, i) => {
        const up = isFaceUp(round, i);
        const found = round.found.includes(i);
        return (
          <button
            key={i}
            className={
              'card-tile' +
              (up ? ' card-tile--up' : '') +
              (found ? ' card-tile--found' : '')
            }
            onClick={() => onCard(i)}
            aria-label={up ? picture : t.card}
          >
            <span className='card-tile__inner' aria-hidden='true'>
              <span className='card-tile__back' />
              <span className='card-tile__front'>{picture}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
