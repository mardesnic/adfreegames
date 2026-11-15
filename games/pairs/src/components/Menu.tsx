import type { Stats } from '../lib/game';
import { type Language, type Strings } from '../lib/i18n';
import { DIFFICULTIES, type Difficulty } from '../lib/pairs';
import { LanguageField, SoundField } from '@shared/Settings';

export function NewGame({
  onStart,
  t,
}: {
  onStart: (d: Difficulty) => void;
  t: Strings;
}) {
  return (
    <section className='card'>
      <h2>{t.newGame}</h2>
      <div className='levels'>
        {DIFFICULTIES.map((d, n) => (
          <button key={d} className='level' onClick={() => onStart(d)}>
            <span className='level__pips' aria-hidden='true'>
              {DIFFICULTIES.map((_, k) => (
                <span key={k} className={k <= n ? 'pip pip--on' : 'pip'} />
              ))}
            </span>
            {t.levels[d]}
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
            {DIFFICULTIES.map((d) => (
              <tr key={d}>
                <th>{t.levels[d]}</th>
                <td>{stats[d].solved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
