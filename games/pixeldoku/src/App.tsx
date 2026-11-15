import { useEffect, useState } from 'react';

import { Board } from './components/Board';
import { pageTitle } from '@shared/page-title';
import { HomeLink } from '@shared/HomeLink';
import { Confetti } from '@shared/Confetti';
import { Solved } from '@shared/Solved';
import { Icon } from '@shared/Icon';
import { NewGame, SettingsView } from './components/Menu';
import {
  initialStats,
  newGame,
  recordWin,
  withStroke,
  type Difficulty,
  type Game,
  type Stats,
} from './lib/game';
import { STRINGS, detectLang } from './lib/i18n';
import { pickPicture, pictureById } from './lib/pixels';
import { popMenu, pushMenu, useBackButton } from '@shared/use-back-button';
import { useCheer } from '@shared/use-cheer';
import { useLanguage, useSound } from '@shared/use-shared-settings';
import { useStoredState } from '@shared/use-stored-state';
import { useWakeLock } from '@shared/use-wake-lock';
import { SettingsFooter } from '@shared/Settings';

type View = 'play' | 'new' | 'settings';

export default function App() {
  // Keys are prefixed: other apps on the same GitHub Pages origin share
  // this storage.
  const [store, setStore] = useStoredState<{ game?: Game }>('pixels', {});
  // A saved game whose picture has since been taken out, or saved by an
  // older version, is dropped.
  const picture =
    Array.isArray(store.game?.coloured) &&
    pictureById(store.game.difficulty, store.game.picture);
  const game = picture ? store.game : undefined;
  const [stats, setStats] = useStoredState<Stats>('pixels-stats', initialStats);
  const [view, setViewState] = useState<View>(game ? 'play' : 'new');
  // Menus open over the game, so the phone's Back button closes them.
  const setView = (next: View) => {
    if (next === 'play') popMenu();
    else pushMenu();
    setViewState(next);
  };
  useBackButton(() => setViewState(game ? 'play' : 'new'));
  const [history, setHistory] = useState<Game[]>([]);
  const [celebrating, setCelebrating] = useState(false);
  useWakeLock();
  const [sound, setSound] = useSound();
  const cheer = useCheer(sound);

  const [language, setLanguage] = useLanguage();
  const lang = language === 'auto' ? detectLang() : language;
  const t = STRINGS[lang];
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = pageTitle(t.title, lang);
  }, [lang, t]);

  const start = (d: Difficulty) => {
    const previous = game?.difficulty === d ? game.picture : undefined;
    const next = pickPicture(d, stats[d], previous, Math.random);
    setStore({ game: newGame(d, next) });
    setHistory([]);
    setView('play');
  };

  const play = (next: Game) => {
    if (!game || next === game) return;
    setHistory((h) => [...h, game]);
    setStore({ game: next });
  };

  const onStroke = (cells: number[], on: boolean) => {
    if (!game || !picture) return;
    const next = withStroke(game, picture, cells, on);
    if (next.solved) {
      setStats(recordWin(stats, next));
      setCelebrating(true);
      cheer();
    }
    play(next);
  };

  const undo = () => {
    if (!game || game.solved || !history.length) return;
    setStore({ game: history.at(-1)! });
    setHistory((h) => h.slice(0, -1));
  };

  const clear = () => {
    if (!game || !picture || game.solved) return;
    play(newGame(game.difficulty, picture));
  };

  const blank = !game?.coloured.some(Boolean);

  return (
    <main className={view === 'play' && game ? 'app app--play' : 'app'}>
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
          ) : game || view === 'settings' ? (
            <button
              className='button button--small button--icon'
              onClick={() => (game ? setView('play') : popMenu())}
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

      {view === 'play' && game && picture && (
        <>
          <div className='stage'>
            <Board
              // A new picture starts with no stroke under way.
              key={picture.id}
              picture={picture}
              coloured={game.coloured}
              solved={game.solved}
              onStroke={onStroke}
              t={t}
            />
          </div>

          {game.solved && (
            <Solved
              title={t.solved}
              next={{ label: t.next, onClick: () => start(game.difficulty) }}
              change={{ label: t.changeLevel, onClick: () => setView('new') }}
            >
              <p className='solved__name'>{t.itsA(picture.name[lang])}</p>
            </Solved>
          )}
          <div
            className={game.solved ? 'under under--hidden' : 'under'}
            inert={!!game.solved}
          >
            <div className='bar'>
              <div className='tools'>
                <button
                  className='tool'
                  onClick={undo}
                  disabled={!history.length}
                  aria-label={t.undo}
                >
                  <Icon name='undo' />
                </button>
                <button
                  className='tool'
                  onClick={clear}
                  disabled={blank}
                  aria-label={t.clear}
                >
                  <Icon name='clear' />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {view === 'settings' && <SettingsFooter game='pixeldoku' t={t} />}
      {celebrating && <Confetti onDone={() => setCelebrating(false)} />}
    </main>
  );
}
