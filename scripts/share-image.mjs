// Makes public/share-1200x630.png, the picture a shared link shows: the app
// icon and its name, centred so it still fits when a chat app crops it to a
// square. Run it again after changing public/favicon.svg:
//   node scripts/share-image.mjs
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const icon = readFileSync(resolve(root, 'public/favicon.svg'), 'utf8').replace(
  '<svg ',
  '<svg x="460" y="70" width="280" height="280" '
);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#e7f0fb"/>
  <defs>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#1971c2" flood-opacity="0.18"/>
    </filter>
  </defs>
  <g filter="url(#s)">${icon}</g>
  <g font-family="DejaVu Sans, sans-serif" text-anchor="middle">
    <text x="600" y="455" font-size="76" font-weight="bold" fill="#1c2430">AdFreeGames</text>
    <text x="600" y="525" font-size="36" fill="#4a5566">Free games for kids · no ads</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(resolve(root, 'public/share-1200x630.png'));
