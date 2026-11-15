import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
// The version shown in Settings: the date and short hash of the last
// commit, so every deploy gets a new one without bumping anything.
const git = (args: string) => {
  try {
    return execSync(`git ${args}`, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};
const version =
  [git('log -1 --format=%cs'), git('rev-parse --short HEAD')]
    .filter(Boolean)
    .join(' · ') || 'dev';

// Where the app lives on the site.
const BASE = '/';

// Every game is its own page under games/<slug>/, so each keeps its own
// styles, but they are built, installed and kept offline together.
const games = readdirSync(resolve(import.meta.dirname, 'games'));
const input = Object.fromEntries([
  ['main', resolve(import.meta.dirname, 'index.html')],
  ...games.map((g) => [
    g,
    resolve(import.meta.dirname, 'games', g, 'index.html'),
  ]),
]);

export default defineConfig({
  define: { __VERSION__: JSON.stringify(version) },
  base: BASE,
  build: { rollupOptions: { input } },
  // Code every game uses, in shared/.
  resolve: { alias: { '@shared': resolve(import.meta.dirname, 'shared') } },
  plugins: [
    react(),
    // Installable from the browser menu, and works offline once loaded.
    VitePWA({
      registerType: 'autoUpdate',
      // The icons' links are in index.html, so a game's page keeps its own.
      pwaAssets: { config: true, includeHtmlHeadLinks: false },
      manifest: {
        // A fixed id of its own, so a phone never mixes it up with an earlier
        // install.
        id: 'adfreegames',
        name: 'AdFreeGames',
        short_name: 'AdFreeGames',
        description: 'A collection of simple, free and ad-free games.',
        theme_color: '#1971c2',
        background_color: '#f4f5f7',
        display: 'standalone',
        start_url: BASE,
        // The games are pages inside this app: a game opened from a card
        // stays in its window (no address bar), and Back comes back here.
        scope: BASE,
      },
      workbox: {
        // Every game, its icon and its pictures, so they all work offline.
        globPatterns: ['**/*.{js,css,html,svg,webp,png,ico}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
});
