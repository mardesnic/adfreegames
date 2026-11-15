import type { Language } from './use-shared-settings';

// The parts of Settings that are the same in every game. They take the game's
// own strings, which use the same words everywhere.

// Each language's name in that language, for the picker.
const LANG_NAMES = { en: 'English', hr: 'Hrvatski' } as const;
const LANGUAGES: Language[] = ['auto', 'en', 'hr'];

// A row of buttons where one is picked.
export function Segmented<T>({
  options,
  value,
  label,
  onChange,
}: {
  options: readonly T[];
  value: T;
  label: (o: T) => string;
  onChange: (o: T) => void;
}) {
  return (
    <div className='segmented'>
      {options.map((o) => (
        <button
          key={String(o)}
          aria-pressed={value === o}
          onClick={() => onChange(o)}
        >
          {label(o)}
        </button>
      ))}
    </div>
  );
}

export function LanguageField({
  language,
  setLanguage,
  t,
}: {
  language: Language;
  setLanguage: (l: Language) => void;
  t: { language: string; automatic: string };
}) {
  return (
    <div className='field'>
      <span>{t.language}</span>
      <Segmented
        options={LANGUAGES}
        value={language}
        label={(l) => (l === 'auto' ? t.automatic : LANG_NAMES[l])}
        onChange={setLanguage}
      />
    </div>
  );
}

export function SoundField({
  sound,
  setSound,
  t,
}: {
  sound: boolean;
  setSound: (on: boolean) => void;
  t: { sound: string; on: string; off: string };
}) {
  return (
    <div className='field'>
      <span>{t.sound}</span>
      <Segmented
        options={[true, false]}
        value={sound}
        label={(on) => (on ? t.on : t.off)}
        onChange={setSound}
      />
    </div>
  );
}

// Under Settings: back to all games, the game's source code and the version.
export function SettingsFooter({
  game,
  t,
}: {
  game: string;
  t: { allGames: string; source: string; version: string };
}) {
  return (
    <footer className='footer'>
      <a href={import.meta.env.BASE_URL}>{t.allGames}</a>
      <a
        href={`https://github.com/mardesnic/adfreegames/tree/main/games/${game}`}
      >
        {t.source}
      </a>
      <span className='footer__version'>
        {t.version} {__VERSION__}
      </span>
    </footer>
  );
}
