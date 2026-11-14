import { describe, expect, it } from 'vitest';

import { move, parse, shortest } from './skeleton';

const at = (x: number, y: number) => y * 5 + x;

describe('move', () => {
  const room = parse('t', ['.....', 'S.#.H', '.....']);
  const start = { skeleton: room.skeleton, skull: room.skull };

  it('mirrors left and right', () => {
    const m = move(room, start, 'right');
    expect(m.pos).toEqual({ skeleton: at(1, 1), skull: at(3, 1) });
    expect(m.won).toBe(false);
  });

  it('shares up and down', () => {
    expect(move(room, start, 'up').pos).toEqual({
      skeleton: at(0, 0),
      skull: at(4, 0),
    });
  });

  it('stops only the one who walks into something', () => {
    const m = move(room, { skeleton: at(1, 1), skull: at(4, 2) }, 'right');
    expect(m.pos).toEqual({ skeleton: at(1, 1), skull: at(3, 2) });
    expect(m.stuck).toEqual({ skeleton: true, skull: false });
  });

  it('stops at the walls of the room', () => {
    const m = move(room, start, 'left');
    expect(m.stuck).toEqual({ skeleton: true, skull: true });
  });

  it('wins on the same square', () => {
    const open = parse('o', ['S.H..']);
    expect(move(open, { skeleton: 0, skull: 2 }, 'right').won).toBe(true);
  });

  it('wins when they pass each other', () => {
    const open = parse('o', ['.SH..']);
    expect(move(open, { skeleton: 1, skull: 2 }, 'right').won).toBe(true);
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
