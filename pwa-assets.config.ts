import {
  defaultAssetName,
  defineConfig,
  minimal2023Preset as preset,
} from '@vite-pwa/assets-generator/config';

const background = { resizeOptions: { background: '#ffffff' } };

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...preset,
    // favicon.svg already has a margin of its own, so the phone icons add
    // little more: Android's round mask still needs some, iOS needs none.
    maskable: { ...preset.maskable, ...background, padding: 0.12 },
    apple: { ...preset.apple, ...background, padding: 0 },
    // Full colour, not the default 60% palette that makes the edges blurry.
    png: { compressionLevel: 9, quality: 100, palette: false },
    // Phones keep an installed app's icons by file name, so a new icon needs
    // new names: change the prefix whenever the phone icons change.
    assetName: (type, size) => `shapes2-${defaultAssetName(type, size)}`,
  },
  images: ['public/favicon.svg'],
});
