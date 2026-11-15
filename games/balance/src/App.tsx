import { useEffect, useState } from 'react';

import { Board } from './components/Board';
import { HomeLink } from '@shared/HomeLink';
import { Icon } from './components/Icon';
import { NewGame, SettingsView } from './components/Menu';
import { Confetti } from '@shared/Confetti';
import { Solved } from '@shared/Solved';
import {
  canUseLeft,
  givenWeight,
  initialStats,
  initialStore,
  isBalanced,
  move,
  newRound,
  place,
  recordWin,
  startOver,
  takeOff,
  undo,
  type Level,
  type Round,
  type Side,
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
  // Keys are prefixed: other apps on the same GitHub Pages origin share
  // this storage.
  const [store, setStore] = useStoredState<Store>('balance', initialStore);
  const [stats, setStats] = useStoredState<Stats>(
    'balance-stats',
    initialStats
  );

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
      round: newRound(level, Math.random, round && givenWeight(round)),
    });
    setView('play');
  };

  const update = (next: Round) => {
    if (!round || next === round) return;
    setStore({ round: next });
    if (isBalanced(next)) {
      setStats(recordWin(stats, next));
      // Once the scale has settled level.
      setTimeout(() => {
        setCelebrating(true);
        cheer();
      }, 700);
    }
  };

  const onPlace = (id: number, side: Side) => {
    if (!round) return;
    const next = place(round, id, side);
    if (next !== round) plop(round.shelf[id].weight);
    update(next);
  };

  const solved = round && isBalanced(round);

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
            <Board
              round={round}
              onPlace={onPlace}
              onTakeOff={(id) => update(takeOff(round, id))}
              onMove={(id, side) => update(move(round, id, side))}
            />
          </div>

          {solved && (
            <Solved
              title={t.solved}
              next={{ label: t.next, onClick: () => start(round.level) }}
              change={{ label: t.changeLevel, onClick: () => setView('new') }}
            />
          )}
          <div
            className={solved ? 'under under--hidden' : 'under'}
            inert={!!solved}
          >
            <div className='bar'>
              <p className='goal'>
                {canUseLeft(round.level) ? t.goalHard : t.goal}
              </p>
              <div className='tools'>
                <button
                  className='tool'
                  onClick={() => update(undo(round))}
                  disabled={!round.history.length}
                  aria-label={t.undo}
                >
                  <Icon name='undo' />
                </button>
                <button
                  className='tool'
                  onClick={() => update(startOver(round))}
                  disabled={!round.placed.length}
                  aria-label={t.startOver}
                >
                  <Icon name='clear' />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {view === 'settings' && <SettingsFooter game='balance' t={t} />}
      {celebrating && <Confetti onDone={() => setCelebrating(false)} />}
    </main>
  );
}
