import { playSound, quiet } from '@shared/use-cheer';

// A soft step when the ninja walks, a bright note when the sun moves, a
// low boop when the sun is in the way, two soft falling notes when a
// guard falls asleep, a jingle for the key and three rising notes as the
// gate opens.
function plop(kind: 'step' | 'sun' | 'no' | 'sleep' | 'key' | 'unlock') {
  playSound(
    (note) => {
      if (kind === 'step') note(392, 0, 0.12);
      else if (kind === 'sun') note(783.99, 0, 0.35);
      else if (kind === 'sleep') {
        note(523.25, 0, 0.25);
        note(392, 0.22, 0.4);
      } else if (kind === 'key') {
        note(880, 0, 0.12);
        note(1174.66, 0.1, 0.2);
      } else if (kind === 'unlock') {
        note(392, 0, 0.15);
        note(587.33, 0.12, 0.15);
        note(783.99, 0.24, 0.3);
      } else note(196, 0, 0.25);
    },
    kind === 'no' ? 30 : 10
  );
}

// Returns the function to call on each move.
export const usePlop = (on: boolean) => (on ? plop : quiet);
