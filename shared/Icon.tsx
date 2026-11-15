// Line icons used by the games. The same tool has the same icon in every
// game; add a new one here rather than drawing it in a game.
const PATHS = {
  close: 'M6 6l12 12M18 6 6 18',
  settings:
    'M20 7h-9M14 17H5M14 17a3 3 0 1 0 6 0 3 3 0 1 0-6 0M4 7a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
  undo: 'M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
  // Start over
  clear: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5',
  erase:
    'm7 21-4.3-4.3a1 1 0 0 1 0-1.4l10-10a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L11 21M7 21h14M9 10l6 6',
  // Throw away everything made so far (Robot's program)
  trash:
    'M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
  check: 'M20 6 9 17l-5-5',
  replay: 'M11 5 6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13',
  back: 'M21 5H9l-7 7 7 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1ZM17 9l-6 6M11 9l6 6',
  go: 'M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5Z',
  stop: 'M6 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  notes: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z',
  hint: 'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2Z',
};

export type IconName = keyof typeof PATHS;

// Solid shapes; the rest are lines.
const FILLED: IconName[] = ['go', 'stop'];

export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className='icon'
      viewBox='0 0 24 24'
      fill={FILLED.includes(name) ? 'currentColor' : 'none'}
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
