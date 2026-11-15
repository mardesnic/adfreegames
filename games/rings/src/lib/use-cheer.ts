import { playSound, quiet } from '@shared/use-cheer';

// A short knock when a ring is put on a peg: lower for a bigger ring.
function plop(size: number) {
  playSound((note) => note(660 * 2 ** (-(size - 1) / 4), 0, 0.15), 15);
}

// Returns the function to call when a ring is moved.
export const usePlop = (on: boolean) => (on ? plop : quiet);
