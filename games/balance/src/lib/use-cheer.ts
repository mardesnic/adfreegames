import { playSound, quiet } from '@shared/use-cheer';

// A short knock when fruit lands on the scale: lower for heavier fruit.
function plop(weight: number) {
  playSound((note) => note(660 / Math.sqrt(weight), 0, 0.18), 15);
}

// Returns the function to call when something is put on the scale.
export const usePlop = (on: boolean) => (on ? plop : quiet);
