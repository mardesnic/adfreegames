# Pattern

A free pattern game for young kids that works offline. A few squares of a grid light up for a moment, then go dark, and the child taps the same squares from memory. It trains visual memory in a way a five-year-old can enjoy.

Made for ages 5 and up. There is no timer and no way to lose. A wrong square only shakes, and the pattern shows again, with the squares already found staying lit.

## Demo

Check out the live demo at: https://mardesnic.github.io/des-pattern/

On your phone, open it and choose **Add to Home Screen** (Safari) or **Install app** (Chrome). It then opens like an app and works offline.

## Features

- Three levels:
  - **Easy**: 3 squares on a 3 × 3 grid
  - **Medium**: 5 squares on a 4 × 4 grid
  - **Hard**: 7 squares on a 5 × 5 grid
- The pattern shows a little longer when it has more squares
- The squares can be tapped in any order
- A count of patterns solved at each level
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
