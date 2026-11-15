import { playSound, quiet } from '@shared/use-cheer';

// A short drip when a drop falls in the tube, a little higher each time.
function plop(nth: number) {
  playSound((note) => note(520 * 2 ** (Math.min(nth, 12) / 24), 0, 0.15), 15);
}

// Returns the function to call when a drop is poured.
export const usePlop = (on: boolean) => (on ? plop : quiet);
