import { useEffect, useState } from 'react';

import { Board } from './components/Board';
import { HomeLink } from './components/HomeLink';
import { Icon } from './components/Icon';
import { NewGame, SettingsView } from './components/Menu';
import { Confetti } from './components/Confetti';
import {
  initialStats,
  initialStore,
  isFound,
  isMiss,
  isSolved,
  newRound,
  recordWin,
  restart,
  showTime,
  tap,
  type Level,
  type Stats,
  type Store,
} from './lib/game';
import { STRINGS, detectLang } from './lib/i18n';
import { popMenu, pushMenu, useBackButton } from './lib/use-back-button';
import { useCheer, usePlop } from './lib/use-cheer';
import { useLanguage, useSound } from './lib/use-shared-settings';
import { useStoredState } from './lib/use-stored-state';
import { useWakeLock } from './lib/use-wake-lock';

type View = 'play' | 'new' | 'settings';

export default function App() {
  // Keys are prefixed: other apps on the same GitHub Pages origin share
  // this storage.
  const [store, setStore] = useStoredState<Store>('pattern', initialStore);
  const [stats, setStats] = useStoredState<Stats>(
    'pattern-stats',
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
      round: newRound(level, Math.random, round),
    });
    setView('play');
  };

  // Each new game, and each wrong square (which starts it over), shows the
  // pattern: a short wait
  // on the empty grid, then the pattern lit, then the child's turn.
  const [shows, setShows] = useState(0);
  const [missed, setMissed] = useState<number>();
  const solved = round && isSolved(round);
  const level = round?.level;
  // Which showing of which pattern the phase belongs to: when that changes,
  // it starts again from 'wait'.
  const showing =
    view === 'play' && level && !solved
      ? `${shows} ${round.pattern.join()}`
      : undefined;
  const [phaseOf, setPhaseOf] = useState<{
    showing?: string;
    phase: 'show' | 'play';
  }>({ phase: 'play' });
  const phase = phaseOf.showing === showing ? phaseOf.phase : 'wait';
  useEffect(() => {
    if (!showing || !level) return;
    const show = setTimeout(() => setPhaseOf({ showing, phase: 'show' }), 700);
    const play = setTimeout(
      () => setPhaseOf({ showing, phase: 'play' }),
      700 + showTime(level)
    );
    return () => {
      clearTimeout(show);
      clearTimeout(play);
    };
  }, [showing, level]);

  useEffect(() => {
    if (missed === undefined) return;
    const id = setTimeout(() => setMissed(undefined), 600);
    return () => clearTimeout(id);
  }, [missed, shows]);

  const onSquare = (square: number) => {
    if (!round || phase !== 'play' || isFound(round, square)) return;
    if (isMiss(round, square)) {
      plop('miss');
      setMissed(square);
      setStore({ round: restart(round) });
      setShows((n) => n + 1);
      return;
    }
    const next = tap(round, square);
    if (next === round) return;
    plop('hit');
    setStore({ round: next });
    if (isSolved(next)) {
      setStats(recordWin(stats, next));
      setTimeout(() => {
        setCelebrating(true);
        cheer();
      }, 400);
    }
  };

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
              showing={phase === 'show'}
              missed={missed}
              disabled={phase !== 'play' || !!solved}
              onSquare={onSquare}
              t={t}
            />
          </div>

          {solved && (
            <section className='card solved'>
              <h2>{t.solved}</h2>
              <div className='solved__actions'>
                <button className='button' onClick={() => start(round.level)}>
                  {t.next}
                </button>
                <button
                  className='button button--secondary'
                  onClick={() => setView('new')}
                >
                  {t.changeLevel}
                </button>
              </div>
            </section>
          )}
        </>
      )}

      {view === 'settings' && (
        <footer className='footer'>
          <a href='/des-kids-games/'>{t.allGames}</a>
          <a href='https://github.com/mardesnic/des-kids-games/tree/main/games/pattern'>{t.source}</a>
          <span className='footer__version'>
            {t.version} {__VERSION__}
          </span>
        </footer>
      )}
      {celebrating && <Confetti onDone={() => setCelebrating(false)} />}
    </main>
  );
}
