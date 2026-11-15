# Memory

A free memory game for young kids that works offline. Cards lie face down, two of each picture. The child turns over two at a time: a pair stays face up, and two different pictures turn back over, so remember where they were. The game is done when every pair is found.

Made for ages 5 and up. There is no timer, no move counter and no way to lose.

## Demo

Check out the live demo at: https://mardesnic.github.io/des-memory/

On your phone, open it and choose **Add to Home Screen** (Safari) or **Install app** (Chrome). It then opens like an app and works offline.

## Features

- Three levels:
  - **Easy**: 12 cards, 6 pairs
  - **Medium**: 20 cards, 10 pairs
  - **Hard**: 30 cards, 15 pairs
- Emoji pictures of animals, fruit, vehicles and toys, mixed, and new ones in each game
- Two cards that are not a pair stay up for a moment, or until the next card is tapped
- A count of games won at each level
- Picks up where you left off after a reload
- Keeps the screen on while you play
- In English and Croatian, following the phone's language unless you pick one
- Light and dark mode
- No ads, accounts or tracking

## Development

```bash
npm install
npm run dev        # local dev server
npm test           # game and translation tests
npm run build      # production build in dist/
```

`npm run deploy` builds the app and publishes it to GitHub Pages.
