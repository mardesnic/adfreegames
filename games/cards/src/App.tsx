import { useEffect, useState } from 'react';

import { Board } from './components/Board';
import { HomeLink } from '@shared/HomeLink';
import { Icon } from './components/Icon';
import { NewGame, SettingsView } from './components/Menu';
import { Confetti } from '@shared/Confetti';
import { Solved } from '@shared/Solved';
import {
  flip,
  hide,
  initialStats,
  initialStore,
  isMiss,
  isSolved,
  newRound,
  recordWin,
  type Level,
  type Round,
  type Stats,
  type Store,
} from './lib/game';
import { STRINGS, detectLang } from './lib/i18n';
import { popMenu, pushMenu, useBackButton } from '@shared/use-back-button';
import { useCheer } from '@shared/use-cheer';
import { usePlop } from './lib/use-cheer';
import { useLanguage, useSound } from '@shared/use-shared-settings';
import { useStoredState } from '@shared/use-stored-state';
import { useWakeLock } from '@shared/use-wake-lock';
import { SettingsFooter } from '@shared/Settings';

type View = 'play' | 'new' | 'settings';

export default function App() {
  const [store, setStore] = useStoredState<Store>('cards', initialStore);
  const [stats, setStats] = useStoredState<Stats>('cards-stats', initialStats);

  const [language, setLanguage] = useLanguage();
  const lang = language === 'auto' ? detectLang() : language;
  const t = STRINGS[lang];
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.title;
  }, [lang, t]);

  const [view, setViewState] = useState<View>(store.round ? 'play' : 'new');
  // Menus open over the game, so the phone's Back button closes them.
  const setView = (next: View) => {
    if (next === 'play') popMenu();
    else pushMenu();
    setViewState(next);
  };
  useBackButton(() => setViewState(store.round ? 'play' : 'new'));
  useWakeLock();
  const [sound, setSound] = useSound();
  const cheer = useCheer(sound);
  const plop = usePlop(sound);
  const [celebrating, setCelebrating] = useState(false);
  const round = store.round;

  const start = (level: Level) => {
    setStore({
      round: newRound(level, Math.random, round),
    });
    setView('play');
  };

  const update = (next: Round) => {
    if (!round || next === round) return;
    setStore({ round: next });
    if (isSolved(next)) {
      setStats(recordWin(stats, next));
      // Once the last card has turned over.
      setTimeout(() => {
        setCelebrating(true);
        cheer();
      }, 500);
    }
  };

  const onCard = (card: number) => {
    if (!round) return;
    const next = flip(round, card);
    if (next === round) return;
    plop(next.found.length > round.found.length);
    update(next);
  };

  // Two cards that are not a pair stay up long enough to remember, then
  // turn back over. Tapping another card turns them back sooner.
  const miss = round && isMiss(round);
  useEffect(() => {
    if (!miss) return;
    const id = setTimeout(
      () => setStore((s) => (s.round ? { round: hide(s.round) } : s)),
      1500
    );
    return () => clearTimeout(id);
  }, [miss, round?.open, setStore]);

  const solved = round && isSolved(round);

  return (
    <main className={view === 'play' && round ? 'app app--play' : 'app'}>
      <header className='header'>
        <div className='header__title'>
          <HomeLink label={t.allGames} />
          <h1>{t.title}</h1>
        </div>
        <div className='header__actions'>
          {view === 'play' ? (
            <>
              <button
                className='button button--small'
                onClick={() => setView('new')}
              >
                {t.newGame}
              </button>
              <button
                className='button button--small button--icon'
                onClick={() => setView('settings')}
                aria-label={t.settings}
              >
                <Icon name='settings' />
              </button>
            </>
          ) : round || view === 'settings' ? (
            <button
              className='button button--small button--icon'
              onClick={() => (round ? setView('play') : popMenu())}
              aria-label={t.close}
            >
              <Icon name='close' />
            </button>
          ) : (
            <button
              className='button button--small button--icon'
              onClick={() => setView('settings')}
              aria-label={t.settings}
            >
              <Icon name='settings' />
            </button>
          )}
        </div>
      </header>

      {view === 'new' && <NewGame onStart={start} t={t} />}
      {view === 'settings' && (
        <SettingsView
          language={language}
          setLanguage={setLanguage}
          sound={sound}
          setSound={setSound}
          stats={stats}
          t={t}
        />
      )}

      {view === 'play' && round && (
        <>
          <div className='stage'>
            <Board round={round} onCard={onCard} t={t} />
          </div>

          {solved && (
            <Solved
              title={t.solved}
              next={{ label: t.next, onClick: () => start(round.level) }}
              change={{ label: t.changeLevel, onClick: () => setView('new') }}
            />
          )}
        </>
      )}

      {view === 'settings' && <SettingsFooter game='cards' t={t} />}
      {celebrating && <Confetti onDone={() => setCelebrating(false)} />}
    </main>
  );
}
