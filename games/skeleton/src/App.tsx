import { useEffect, useState } from 'react';

import { Board, type Bump, type Who } from './components/Board';
import { Confetti } from '@shared/Confetti';
import { HomeLink } from '@shared/HomeLink';
import { Icon } from './components/Icon';
import { Levels } from './components/Levels';
import { SettingsView } from './components/Menu';
import {
  newGame,
  nextLevel,
  play,
  recordWin,
  savedGame,
  type Game,
  type Progress,
} from './lib/game';
import { STRINGS, detectLang } from './lib/i18n';
import { LEVELS, levelById } from './lib/levels';
import { mirror, type Dir } from './lib/skeleton';
import { popMenu, pushMenu, useBackButton } from '@shared/use-back-button';
import { useCheer } from './lib/use-cheer';
import { useLanguage, useSound } from '@shared/use-shared-settings';
import { useStoredState } from '@shared/use-stored-state';
import { useWakeLock } from '@shared/use-wake-lock';

type View = 'play' | 'levels' | 'settings';

const KEYS: Record<string, Dir> = {
  ArrowLeft: 'left',
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowRight: 'right',
};

export default function App() {
  // Keys are prefixed: other apps on the same GitHub Pages origin share
  // this storage.
  const [store, setStore] = useStoredState<{ game?: Game }>('skeleton', {});
  const game = savedGame(store.game) ?? newGame(LEVELS[0].id);
  const level = levelById(game.level)!;
  // Wrapped in an object: stored state is merged as an object.
  const [stored, setStored] = useStoredState<{ won: Progress }>(
    'skeleton-progress',
    { won: [] }
  );
  const progress = Array.isArray(stored.won) ? stored.won : [];

  const [view, setViewState] = useState<View>('play');
  // Menus open over the game, so the phone's Back button closes them.
  const setView = (next: View) => {
    if (next === 'play') popMenu();
    else pushMenu();
    setViewState(next);
  };
  useBackButton(() => setViewState('play'));
  const [bump, setBump] = useState<Bump>();
  // Well done shows once the dance is over; a game saved as won shows it
  // at once.
  const [danced, setDanced] = useState(game.won);
  const [celebrating, setCelebrating] = useState(false);
  useWakeLock();
  const [sound, setSound] = useSound();
  const cheer = useCheer(sound);

  const [language, setLanguage] = useLanguage();
  const lang = language === 'auto' ? detectLang() : language;
  const t = STRINGS[lang];
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.title;
  }, [lang, t]);

  // The skull swiped one way is the skeleton going the mirrored way.
  const swipe = (who: Who, dir: Dir) => go(who === 'skull' ? mirror(dir) : dir);

  const go = (dir: Dir) => {
    const { game: next, move } = play(game, dir);
    if (!move) return;
    if (move.stuck.skeleton || move.stuck.skull) {
      setBump((b) => ({ ...move.stuck, n: (b?.n ?? 0) + 1 }));
      if (sound && !move.won) navigator.vibrate?.(30);
    }
    if (next.won) {
      setStored({ won: recordWin(progress, next) });
      cheer();
    }
    setStore({ game: next });
  };

  useEffect(() => {
    if (view !== 'play') return;
    const onKey = (e: KeyboardEvent) => {
      const dir = KEYS[e.key];
      if (!dir) return;
      e.preventDefault();
      go(dir);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const start = (id: string) => {
    setStore({ game: newGame(id) });
    setBump(undefined);
    setDanced(false);
  };

  // Every level unsolved again, starting from the first.
  const resetProgress = () => {
    setStored({ won: [] });
    start(LEVELS[0].id);
  };

  const n = LEVELS.indexOf(level) + 1;
  const last = n === LEVELS.length;

  return (
    <main className={view === 'play' ? 'app app--play' : 'app'}>
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
                onClick={() => setView('levels')}
              >
                {t.levels}
              </button>
              <button
                className='button button--small button--icon'
                onClick={() => setView('settings')}
                aria-label={t.settings}
              >
                <Icon name='settings' />
              </button>
            </>
          ) : (
            <button
              className='button button--small button--icon'
              onClick={() => setView('play')}
              aria-label={t.close}
            >
              <Icon name='close' />
            </button>
          )}
        </div>
      </header>

      {view === 'levels' && (
        <Levels
          current={game.level}
          progress={progress}
          onPick={(id) => {
            start(id);
            setView('play');
          }}
          t={t}
        />
      )}
      {view === 'settings' && (
        <SettingsView
          language={language}
          setLanguage={setLanguage}
          sound={sound}
          setSound={setSound}
          done={LEVELS.filter((l) => progress.includes(l.id)).length}
          total={LEVELS.length}
          onReset={resetProgress}
          t={t}
        />
      )}

      {view === 'play' && (
        <>
          <div className='stage'>
            <Board
              // A new level starts with nothing shaking.
              key={level.id}
              level={level}
              pos={game.pos}
              won={game.won}
              bump={bump}
              onSwipe={swipe}
              onDanced={() => {
                setDanced(true);
                setCelebrating(true);
              }}
              t={t}
            />
          </div>

          {game.won && danced && (
            <section className='card solved'>
              <h2>{last ? t.finale : t.solved}</h2>
              <div className='solved__actions'>
                <button
                  className='button'
                  onClick={() => start(nextLevel(level.id))}
                >
                  {t.next}
                </button>
                <button
                  className='button button--secondary'
                  onClick={() => setView('levels')}
                >
                  {t.changeLevel}
                </button>
              </div>
            </section>
          )}
          <div
            className={game.won ? 'under under--hidden' : 'under'}
            inert={game.won}
          >
            <div className='bar'>
              <span className='bar__level'>{t.level(n)}</span>
            </div>
          </div>
        </>
      )}

      {view === 'settings' && (
        <footer className='footer'>
          <a href={import.meta.env.BASE_URL}>{t.allGames}</a>
          <a href='https://github.com/mardesnic/adfreegames/tree/main/games/skeleton'>
            {t.source}
          </a>
          <span className='footer__version'>
            {t.version} {__VERSION__}
          </span>
        </footer>
      )}
      {celebrating && <Confetti onDone={() => setCelebrating(false)} />}
    </main>
  );
}
