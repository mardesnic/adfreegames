import { playSound, quiet } from '@shared/use-cheer';

// A soft click when a pipe turns, and a bright note when the water reaches
// further.
function plop(kind: 'turn' | 'flow') {
  playSound(
    (note) => {
      if (kind === 'turn') note(392, 0, 0.12);
      else note(783.99, 0, 0.35);
    },
    kind === 'turn' ? 8 : 15
  );
}

// Returns the function to call when a pipe is turned.
export const usePlop = (on: boolean) => (on ? plop : quiet);
