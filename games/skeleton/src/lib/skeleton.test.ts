import { describe, expect, it } from 'vitest';

import {
  mirror,
  move,
  parse,
  shortest,
  startPos as startPosOf,
} from './skeleton';

const at = (x: number, y: number) => y * 5 + x;

describe('move', () => {
  const room = parse('t', ['.....', 'S.#.H', '.....']);
  const start = { skeleton: room.skeleton, skull: room.skull, trunks: [] };

  it('mirrors left and right', () => {
    const m = move(room, start, 'right');
    expect(m.pos).toMatchObject({ skeleton: at(1, 1), skull: at(3, 1) });
    expect(m.won).toBe(false);
  });

  it('shares up and down', () => {
    expect(move(room, start, 'up').pos).toMatchObject({
      skeleton: at(0, 0),
      skull: at(4, 0),
    });
  });

  it('stops only the one who walks into something', () => {
    const m = move(
      room,
      { skeleton: at(1, 1), skull: at(4, 2), trunks: [] },
      'right'
    );
    expect(m.pos).toMatchObject({ skeleton: at(1, 1), skull: at(3, 2) });
    expect(m.stuck).toEqual({ skeleton: true, skull: false });
  });

  it('stops at the walls of the room', () => {
    const m = move(room, start, 'left');
    expect(m.stuck).toEqual({ skeleton: true, skull: true });
  });

  it('wins on the same square', () => {
    const open = parse('o', ['S.H..']);
    expect(move(open, { skeleton: 0, skull: 2, trunks: [] }, 'right').won).toBe(
      true
    );
  });

  it('wins when they pass each other', () => {
    const open = parse('o', ['.SH..']);
    expect(move(open, { skeleton: 1, skull: 2, trunks: [] }, 'right').won).toBe(
      true
    );
  });
});

describe('mirror', () => {
  it('swaps left and right only', () => {
    expect(mirror('left')).toBe('right');
    expect(mirror('right')).toBe('left');
    expect(mirror('up')).toBe('up');
  });

  it('moving the skull is moving the skeleton the mirrored way', () => {
    const room = parse('m', ['S...H']);
    const m = move(room, { skeleton: 0, skull: 4, trunks: [] }, mirror('left'));
    expect(m.pos).toMatchObject({ skeleton: 1, skull: 3, trunks: [] });
  });
});

describe('shortest', () => {
  it('counts moves to meet', () => {
    expect(shortest(parse('a', ['S...H']))).toBe(2);
  });

  it('is Infinity when they can never meet', () => {
    expect(shortest(parse('b', ['S#H', '.#.']))).toBe(Infinity);
  });
});

describe('beds and bookcases', () => {
  it('lets only the skull roll under a bed', () => {
    const room = parse('b', ['.b.', 'SbH']);
    const m = move(room, { skeleton: 3, skull: 5, trunks: [] }, 'right');
    expect(m.pos).toMatchObject({ skeleton: 3, skull: 4, trunks: [] });
    expect(m.stuck).toEqual({ skeleton: true, skull: false });
  });

  it('opens a bookcase while the skeleton is on the creaky board', () => {
    const room = parse('d', ['So...', '...dH']);
    // The skeleton steps on the board, and the skull goes through at once.
    const on = move(room, { skeleton: 0, skull: 9, trunks: [] }, 'right');
    expect(on.pos).toMatchObject({ skeleton: 1, skull: 8, trunks: [] });
    // Stepping off, it shuts before the skull gets in.
    const off = move(room, { skeleton: 1, skull: 9, trunks: [] }, 'right');
    expect(off.pos).toMatchObject({ skeleton: 2, skull: 9, trunks: [] });
  });
});

describe('trunks and rugs', () => {
  it('lets the skeleton push a trunk, but not the skull', () => {
    const room = parse('t', ['St..', '..tH']);
    const m = move(room, { skeleton: 0, skull: 7, trunks: [1, 6] }, 'right');
    expect(m.pos).toEqual({ skeleton: 1, skull: 7, trunks: [2, 6] });
    expect(m.stuck).toEqual({ skeleton: false, skull: true });
  });

  it('holds a bookcase open with a trunk on the board', () => {
    // The skeleton is off the board, but the trunk it pushed is on it.
    const room = parse('d', ['Sto..', '...dH']);
    const m = move(room, startPosOf(room), 'right');
    expect(m.pos).toEqual({ skeleton: 1, skull: 8, trunks: [2] });
  });

  it('slides on a rug until something stops it', () => {
    const room = parse('r', ['Srrr.', 'H....']);
    const m = move(room, startPosOf(room), 'right');
    expect(m.pos.skeleton).toBe(4);
  });

  it('meets half way along a slide', () => {
    const room = parse('m', ['Srrr.H']);
    expect(move(room, startPosOf(room), 'right').won).toBe(true);
  });
});
