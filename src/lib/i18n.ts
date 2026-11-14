import type { Tile } from './skeleton';

export const LANGS = ['en', 'hr'] as const;
export type Lang = (typeof LANGS)[number];
export type Language = 'auto' | Lang;

// Each language's name in that language, for the picker.
export const LANG_NAMES: Record<Lang, string> = {
  en: 'English',
  hr: 'Hrvatski',
};

export function detectLang(): Lang {
  const preferred = navigator.languages ?? [navigator.language];
  return preferred.some((l) => l.toLowerCase().startsWith('hr')) ? 'hr' : 'en';
}

const en = {
  title: 'Skeleton',
  settings: 'Settings',
  close: 'Close',
  levels: 'Levels',
  won: 'done',
  locked: 'locked',
  level: (n: number) => `Level ${n}`,
  tiles: {
    floor: 'Floor',
    crate: 'Crate',
    piano: 'Piano',
    clock: 'Old clock',
    couch: 'Couch',
    candles: 'Candlestick',
    bed: 'Bed',
    board: 'Creaky floorboard',
    bookcase: 'Bookcase',
  } as Record<Tile, string>,
  skeleton: 'Skeleton',
  skull: 'Skull',
  solved: 'Well done!',
  finale: 'You did it all!',
  next: 'Next',
  changeLevel: 'Change level',
  language: 'Language',
  automatic: 'Automatic',
  sound: 'Sound and vibration',
  on: 'On',
  off: 'Off',
  allGames: 'All games',
  source: 'Source',
  version: 'Version',
  progress: 'Progress',
  progressCount: (done: number, total: number) =>
    `Levels done: ${done} / ${total}`,
  resetProgress: 'Reset progress',
  resetAsk: 'Every level will be unsolved again, and you start from level 1.',
  resetYes: 'Yes, reset',
  cancel: 'Cancel',
  resetDone: 'Progress reset.',
};

export type Strings = typeof en;

const hr: Strings = {
  title: 'Kostur',
  settings: 'Postavke',
  close: 'Zatvori',
  levels: 'Razine',
  won: 'riješeno',
  locked: 'zaključano',
  level: (n: number) => `Razina ${n}`,
  tiles: {
    floor: 'Pod',
    crate: 'Sanduk',
    piano: 'Klavir',
    clock: 'Starinski sat',
    couch: 'Kauč',
    candles: 'Svijećnjak',
    bed: 'Krevet',
    board: 'Škripava daska',
    bookcase: 'Polica s knjigama',
  },
  skeleton: 'Kostur',
  skull: 'Lubanja',
  solved: 'Bravo!',
  finale: 'Sve je riješeno!',
  next: 'Dalje',
  changeLevel: 'Promijeni razinu',
  language: 'Jezik',
  automatic: 'Automatski',
  sound: 'Zvuk i vibracija',
  on: 'Uključeno',
  off: 'Isključeno',
  allGames: 'Sve igre',
  source: 'Izvorni kod',
  version: 'Verzija',
  progress: 'Napredak',
  progressCount: (done: number, total: number) =>
    `Riješene razine: ${done} / ${total}`,
  resetProgress: 'Resetiraj napredak',
  resetAsk: 'Sve razine opet će biti neriješene i krećeš od 1. razine.',
  resetYes: 'Da, resetiraj',
  cancel: 'Odustani',
  resetDone: 'Napredak je resetiran.',
};

export const STRINGS: Record<Lang, Strings> = { en, hr };
