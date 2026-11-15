import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
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

// For search engines and shared links: each page's canonical address and
// preview card (from its own <title> and description), and a sitemap of the
// home page and every game.
const SITE = 'https://adfreegames.eu';
// Wide, so link previews don't crop it; made by scripts/share-image.mjs.
const SHARE_IMAGE = `${SITE}${BASE}share-1200x630.png`;
const pageUrl = (game?: string) =>
  `${SITE}${BASE}${game ? `games/${game}/` : ''}`;
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const seo = (): Plugin => ({
  name: 'seo',
  apply: 'build',
  transformIndexHtml(html, { path }) {
    const game = /games\/([^/]+)\//.exec(path)?.[1];
    const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? 'AdFreeGames';
    const description =
      /name="description"\s+content="([^"]*)"/.exec(html)?.[1] ?? '';
    const url = pageUrl(game);
    const meta = (property: string, content: string) => ({
      tag: 'meta',
      attrs: { property, content },
      injectTo: 'head' as const,
    });
    return [
      { tag: 'link', attrs: { rel: 'canonical', href: url }, injectTo: 'head' },
      meta('og:type', 'website'),
      meta('og:site_name', 'AdFreeGames'),
      meta('og:title', title),
      meta('og:description', description),
      meta('og:url', url),
      meta('og:image', SHARE_IMAGE),
      meta('og:image:width', '1200'),
      meta('og:image:height', '630'),
      {
        tag: 'meta',
        attrs: { name: 'twitter:card', content: 'summary_large_image' },
        injectTo: 'head',
      },
    ];
  },
  generateBundle() {
    const urls = [pageUrl(), ...games.map((g) => pageUrl(g))];
    this.emitFile({
      type: 'asset',
      fileName: 'sitemap.xml',
      source:
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls.map((u) => `  <url><loc>${escape(u)}</loc></url>\n`).join('') +
        '</urlset>\n',
    });
    this.emitFile({
      type: 'asset',
      fileName: 'robots.txt',
      source: `User-agent: *\nAllow: /\n\nSitemap: ${pageUrl()}sitemap.xml\n`,
    });
  },
});

export default defineConfig({
  define: { __VERSION__: JSON.stringify(version) },
  base: BASE,
  build: { rollupOptions: { input } },
  // Code every game uses, in shared/.
  resolve: { alias: { '@shared': resolve(import.meta.dirname, 'shared') } },
  plugins: [
    react(),
    seo(),
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
