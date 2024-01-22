export const AVAILABLE_GOOGLE_FONTS = [
  "Montserrat",
  "Poppins",
  "Chivo Mono",
  "Raleway",
  "Oswald",
  "Roboto",
  "Noto Sans",
  "Nunito",
  "Kanit",
  "Sofia Sans Condensed",
  "Work Sans",
  "Fira Sans",
  "Barlow",
  "Barlow Condensed",
  "Mulish",
  "Libre Franklin",
  "Bitter",
  "Prompt",
  "Exo 2"
]

const defaultUnicodeRange =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"

function sanitizeFontName(fontName) {
  return fontName.replace(/\s+/g, "+")
}

export function buildFontHref(fontName) {
  debugger
  return `https://fonts.googleapis.com/css2?family=${sanitizeFontName(fontName)}&display=swap`
}

export function buildFontImport(fontName) {
  return `@import url('https://fonts.googleapis.com/css2?family=${sanitizeFontName(fontName)}&display=swap');`
}

export function buildFontFace(fontName, weight) {
  return `@font-face {
        font-family: '${fontName}';
        font-style: normal;
        font-weight: ${weight};
        font-display: swap;
        src: url('https://fonts.googleapis.com/css?family=${sanitizeFontName(fontName)}');
        unicode-range: ${defaultUnicodeRange};
      }`
}
