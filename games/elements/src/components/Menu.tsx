import { useState } from 'react';

import { type Language, type Strings } from '../lib/i18n';
import { LanguageField, SoundField } from '@shared/Settings';

export function SettingsView({
  language,
  setLanguage,
  sound,
  setSound,
  done,
  total,
  onReset,
  t,
}: {
  language: Language;
  setLanguage: (l: Language) => void;
  sound: boolean;
  setSound: (on: boolean) => void;
  // Levels won so far, out of all of them.
  done: number;
  total: number;
  onReset: () => void;
  t: Strings;
}) {
  // Resetting asks first, so one stray tap can't wipe out the progress.
  const [asking, setAsking] = useState(false);
  const [wasReset, setWasReset] = useState(false);

  return (
    <section className='card'>
      <h2>{t.settings}</h2>

      <LanguageField language={language} setLanguage={setLanguage} t={t} />

      <SoundField sound={sound} setSound={setSound} t={t} />

      <div className='field'>
        <span>
          {t.progress}
          <span className='muted'>
            {wasReset ? t.resetDone : t.progressCount(done, total)}
          </span>
        </span>
        {asking ? (
          <>
            <span className='muted'>{t.resetAsk}</span>
            <div className='reset'>
              <button
                className='button button--danger'
                onClick={() => {
                  onReset();
                  setAsking(false);
                  setWasReset(true);
                }}
              >
                {t.resetYes}
              </button>
              <button
                className='button button--secondary'
                onClick={() => setAsking(false)}
              >
                {t.cancel}
              </button>
            </div>
          </>
        ) : (
          <button
            className='button button--secondary'
            disabled={!done}
            onClick={() => setAsking(true)}
          >
            {t.resetProgress}
          </button>
        )}
      </div>
    </section>
  );
}
