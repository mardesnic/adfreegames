import type { ReactNode } from 'react';
import './solved.css';

type Action = { label: string; onClick: () => void };

// The card that pops up at the bottom of the screen when a puzzle is solved.
// It floats over the game, so nothing on the page moves. Its buttons take the
// game's own colours. `delay` (ms) lets the game's own win animation play
// first; `children` are extra lines under the title.
export function Solved({
  title,
  next,
  change,
  delay,
  children,
}: {
  title: string;
  next?: Action;
  change?: Action;
  delay?: number;
  children?: ReactNode;
}) {
  return (
    <section
      className='card solved'
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      <h2>{title}</h2>
      {children}
      {(next || change) && (
        <div className='solved__actions'>
          {next && (
            <button className='button' onClick={next.onClick}>
              {next.label}
            </button>
          )}
          {change && (
            <button
              className='button button--secondary'
              onClick={change.onClick}
            >
              {change.label}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
