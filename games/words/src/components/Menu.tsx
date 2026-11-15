import type { Stats } from '../lib/game';
import { type Language, type Strings } from '../lib/i18n';
import { LEVELS, type Level } from '../lib/spell';
import { LanguageField, SoundField } from '@shared/Settings';

export function NewGame({
  onStart,
  t,
}: {
  onStart: (l: Level) => void;
  t: Strings;
}) {
  return (
    <section className='card'>
      <h2>{t.newGame}</h2>
      <div className='levels'>
        {LEVELS.map((l, n) => (
          <button key={l} className='level' onClick={() => onStart(l)}>
            <span className='level__pips' aria-hidden='true'>
              {LEVELS.map((_, k) => (
                <span key={k} className={k <= n ? 'pip pip--on' : 'pip'} />
              ))}
            </span>
            {t.levels[l]}
            <span className='level__note'>{t.levelNotes[l]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function SettingsView({
  sound,
  language,
  setLanguage,
  setSound,
  stats,
  t,
}: {
  sound: boolean;
  language: Language;
  setLanguage: (l: Language) => void;
  setSound: (on: boolean) => void;
  stats: Stats;
  t: Strings;
}) {
  return (
    <>
      <section className='card'>
        <h2>{t.settings}</h2>

        <LanguageField language={language} setLanguage={setLanguage} t={t} />

        <SoundField sound={sound} setSound={setSound} t={t} />
      </section>

      <section className='card'>
        <h2>{t.statistics}</h2>
        <table className='stats'>
          <thead>
            <tr>
              <th />
              <th>{t.solvedColumn}</th>
            </tr>
          </thead>
          <tbody>
            {LEVELS.map((l) => (
              <tr key={l}>
                <th>{t.levels[l]}</th>
                <td>{stats[l].solved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
