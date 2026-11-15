import { useEffect, useMemo, useState } from 'react';

import { Board } from './components/Board';
import { HomeLink } from '@shared/HomeLink';
import { Confetti } from '@shared/Confetti';
import { Solved } from '@shared/Solved';
import { Icon } from '@shared/Icon';
import { NewGame, SettingsView } from './components/Menu';
import {
  initialStats,
  newGame,
  recordWin,
  withPiece,
  type Difficulty,
  type Game,
  type Stats,
} from './lib/game';
import { STRINGS, detectLang } from './lib/i18n';
import { levelById, pickLevel, pictureOf } from './lib/levels';
import { puzzleOf, stillFits, type Piece } from './lib/shapes';
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
  const [store, setStore] = useStoredState<{ game?: Game }>('shapes', {});
  // A saved game whose level has since been taken out, or saved by an
  // older version, is dropped.
  const saved = store.game;
  const level =
    Array.isArray(saved?.pieces) && levelById(saved.difficulty, saved.level);
  const puzzle = useMemo(() => level && puzzleOf(level), [level]);
  const game =
    saved && puzzle && stillFits(puzzle, saved.pieces) ? saved : undefined;
  const picture = level && game && pictureOf(game.difficulty, level);
  const [stats, setStats] = useStoredState<Stats>('shapes-stats', initialStats);
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
    document.title = t.title;
  }, [lang, t]);

  const start = (d: Difficulty) => {
    const previous = game?.difficulty === d ? game.level : undefined;
    const next = pickLevel(d, stats[d], previous, Math.random);
    setStore({ game: newGame(d, next) });
    setHistory([]);
    setView('play');
  };

  const play = (next: Game) => {
    if (!game || next === game) return;
    setHistory((h) => [...h, game]);
    setStore({ game: next });
  };

  const onMove = (i: number, piece: Piece) => {
    if (!game) return;
    const next = withPiece(game, i, piece);
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
    if (!game || !level || game.solved) return;
    play(newGame(game.difficulty, level));
  };

  const blank =
    !level ||
    !!game?.pieces.every((p, k) => !p.at && p.turns === level.turns[k]);

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

      {view === 'play' && game && puzzle && picture && (
        <>
          <Board
            // A new level starts with nothing held.
            key={game.level}
            puzzle={puzzle}
            picture={picture}
            pieces={game.pieces}
            solved={game.solved}
            onMove={onMove}
            t={t}
          />

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

      {view === 'settings' && <SettingsFooter game='shapes' t={t} />}
      {celebrating && <Confetti onDone={() => setCelebrating(false)} />}
    </main>
  );
}
