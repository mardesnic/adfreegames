const PATHS = {
  close: 'M6 6l12 12M18 6 6 18',
  settings:
    'M20 7h-9M14 17H5M14 17a3 3 0 1 0 6 0 3 3 0 1 0-6 0M4 7a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
  left: 'M19 12H5M11 6l-6 6 6 6',
  up: 'M12 19V5M6 11l6-6 6 6',
  down: 'M12 5v14M6 13l6 6 6-6',
  right: 'M5 12h14M13 6l6 6-6 6',
};

export function Icon({ name }: { name: keyof typeof PATHS }) {
  return (
    <svg
      className='icon'
      viewBox='0 0 24 24'
      fill='none'
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
