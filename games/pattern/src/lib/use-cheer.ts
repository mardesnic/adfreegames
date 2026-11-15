import { playSound, quiet } from '@shared/use-cheer';

// A bright note for a square of the pattern, and a low, short one for a
// wrong square.
function plop(kind: 'hit' | 'miss') {
  playSound(
    (note) => {
      if (kind === 'hit') note(659.25, 0, 0.3);
      else note(196, 0, 0.25);
    },
    kind === 'hit' ? 12 : [30, 40, 30]
  );
}

// Returns the function to call when a square is tapped.
export const usePlop = (on: boolean) => (on ? plop : quiet);
