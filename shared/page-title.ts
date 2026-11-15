// The browser tab's and search results' title of a game's page: its name, what
// it is and the app's name, so a search for a kids game can find it.
const TAGLINE = {
  en: 'free game for kids',
  hr: 'besplatna igra za djecu',
} as const;

export const pageTitle = (name: string, lang: 'en' | 'hr') =>
  `${name} – ${TAGLINE[lang]} | AdFreeGames`;
