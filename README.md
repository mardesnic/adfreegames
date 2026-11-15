# AdFreeGames

A collection of simple, free and ad-free games: puzzles, words, numbers and music. Each card opens a game. No timer, no way to lose, no accounts and no tracking.

## Demo

Check out the live demo at: https://adfreegames.eu/

On your phone, open it and choose **Add to Home Screen** (Safari) or **Install app** (Chrome). Then one icon on the home screen opens every game: a game opened from a card stays in the same window, and Back comes back to the list.

## Features

- A big card for each game, with its icon, name and one short line
- Only finished games are shown
- A game opens in the same window, and Back comes back to the list
- Settings show how to install it on a phone
- In English and Croatian, following the phone's language unless you pick one in Settings
- The phone's Back button closes Settings
- Light and dark mode
- No ads, accounts or tracking

## Development

Every game is its own page in `games/<name>/`, with its logic and tests in `src/lib/`. Code all games share (settings, Back button, saving, confetti) is in `shared/`, imported as `@shared/...`. They are built, installed and kept offline together as one app.

```bash
npm install
npm run dev        # local dev server: the list, and each game at /games/<name>/
npm test           # every game's tests
npm run lint
npm run typecheck
npm run build      # production build in dist/
```

`npm run deploy` runs the tests, builds the app and publishes it to GitHub Pages.

Some games ship levels made by a script in `games/<name>/scripts/`; run it from the game's folder (`npm run levels:elements`, `npm run levels:shapes`).

To add a game, put it in `games/<name>/` with its icon in `public/games/<name>/favicon.svg`, and add it to `src/lib/games.ts` with `ready: true` when it is done.
