# Skeleton

A free puzzle game for young kids that works offline. In a haunted house, a skeleton has lost its head. The child swipes the skeleton or its skull, and that one goes the way of the swipe while the other goes like a mirror: the same way up and down, but the other way left and right. Crates, pumpkins and the walls stop only the one who walks into them. When the two meet, the skull hops back on and the skeleton dances. There is no timer and no way to lose.

## Demo

Check out the live demo at: https://mardesnic.github.io/des-skeleton/

On your phone, open it and choose **Add to Home Screen** (Safari) or **Install app** (Chrome). It then opens like an app and works offline.

## Features

- Hand-made levels, from just walking towards each other to using crates and walls to hold one still
- Swipe the skeleton or the skull, whichever the swipe starts nearer to
- Every level can be won, and no move ever leaves it unwinnable (checked by a test)
- Made for holding the phone upright
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
