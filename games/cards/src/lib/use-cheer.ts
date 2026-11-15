import { playSound, quiet } from '@shared/use-cheer';

// A soft tick when a card turns over, and two rising notes when it makes a
// pair.
function plop(pair: boolean) {
  playSound(
    (note) => {
      note(523.25, 0, 0.12);
      if (pair) note(783.99, 0.1, 0.35);
    },
    pair ? [15, 60, 30] : 10
  );
}

// Returns the function to call when a card is turned over.
export const usePlop = (on: boolean) => (on ? plop : quiet);
