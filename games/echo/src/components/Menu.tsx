import { PAD_COUNTS, type Stats } from '../lib/echo';
import { type Language, type Strings } from '../lib/i18n';
import type { Settings } from '../lib/settings';
import { Segmented, LanguageField } from '@shared/Settings';

export function SettingsView({
  settings,
  language,
  setLanguage,
  setSettings,
  stats,
  t,
}: {
  settings: Settings;
  language: Language;
  setLanguage: (l: Language) => void;
  setSettings: (s: Settings) => void;
  stats: Stats;
  t: Strings;
}) {
  return (
    <>
      <section className='card'>
        <h2>{t.settings}</h2>

        <div className='field'>
          <span>{t.players}</span>
          <Segmented
            options={[1, 2] as const}
            value={settings.players}
            label={String}
            onChange={(players) => setSettings({ ...settings, players })}
          />
        </div>

        <div className='field'>
          <span>{t.pads}</span>
          <Segmented
            options={PAD_COUNTS}
            value={settings.pads}
            label={String}
            onChange={(pads) => setSettings({ ...settings, pads })}
          />
        </div>

        <LanguageField language={language} setLanguage={setLanguage} t={t} />
      </section>

      <section className='card'>
        <h2>{t.statistics}</h2>
        <table className='stats'>
          <tbody>
            <tr>
              <th>{t.songsPlayed}</th>
              <td>{stats.songs}</td>
            </tr>
            {PAD_COUNTS.map((n) => (
              <tr key={n}>
                <th>{t.longest(n)}</th>
                <td>{stats.best[n] ?? 0}</td>
              </tr>
            ))}
            {PAD_COUNTS.map((n) => (
              <tr key={`solo-${n}`}>
                <th>{t.longestSolo(n)}</th>
                <td>{stats.solo[n] ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
