const basePalette = {
  colors: {
    teal: {
      50: "#EBFAF7",
      100: "#C6F1E8",
      200: "#A1E8D9",
      300: "#7CDFCA",
      400: "#57D6BA",
      500: "#32CDAB",
      600: "#28A489",
      700: "#1E7B67",
      800: "#145245",
      900: "#0A2922"
    },
    cyan: {
      50: "#E9FBFC",
      100: "#C0F4F6",
      200: "#98EDF0",
      300: "#70E6EB",
      400: "#48DEE5",
      500: "#20D7DF",
      600: "#19ACB3",
      700: "#138186",
      800: "#0D5659",
      900: "#062B2D"
    },
    blue: {
      50: "#E6F4FE",
      100: "#B9E2FD",
      200: "#8DCFFC",
      300: "#60BCFB",
      400: "#33A9FA",
      500: "#0696F9",
      600: "#0578C7",
      700: "#045A95",
      800: "#033C63",
      900: "#011E32"
    },
    green: {
      50: "#EFF7EE",
      100: "#D1E8CE",
      200: "#B4DAAF",
      300: "#96CB90",
      400: "#79BD70",
      500: "#5BAE51",
      600: "#498B41",
      700: "#376831",
      800: "#254620",
      900: "#122310"
    },
    purple: {
      50: "#EBEBFA",
      100: "#C6C7F1",
      200: "#A1A3E7",
      300: "#7D7FDE",
      400: "#585BD5",
      500: "#3337CC",
      600: "#292CA3",
      700: "#1F217A",
      800: "#141652",
      900: "#0A0B29"
    },
    pink: {
      50: "#FBE9F6",
      100: "#F4C2E6",
      200: "#EE9BD7",
      300: "#E774C7",
      400: "#E04DB7",
      500: "#D926A7",
      600: "#AE1E86",
      700: "#821764",
      800: "#570F43",
      900: "#2B0821"
    },
    red: {
      50: "#FCE9E9",
      100: "#F7C3C0",
      200: "#F19C98",
      300: "#EC756F",
      400: "#E64E47",
      500: "#E1281E",
      600: "#B42018",
      700: "#871812",
      800: "#5A100C",
      900: "#2D0806"
    },
    orange: {
      50: "#FDF2E7",
      100: "#FADBBD",
      200: "#F6C592",
      300: "#F3AE68",
      400: "#F0973D",
      500: "#ED8012",
      600: "#BD670F",
      700: "#8E4D0B",
      800: "#5F3307",
      900: "#2F1A04"
    },
    yellow: {
      50: "#FFF7E5",
      100: "#FFE8B8",
      200: "#FFD98A",
      300: "#FFCB5C",
      400: "#FFBC2E",
      500: "#FFAD00",
      600: "#CC8A00",
      700: "#996800",
      800: "#664500",
      900: "#332300"
    },
    gray: {
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#94949D" /* adjusted for 3:1 contrast ratio */,
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b"
    },
    blackAlpha: {
      50: "rgba(0,0,0,0.02)",
      100: "rgba(0,0,0,0.04)",
      200: "rgba(0,0,0,0.10)",
      300: "rgba(0,0,0,0.17)",
      400: "rgba(0,0,0,0.42)" /* adjusted for 3:1 contrast ratio */,
      500: "rgba(0,0,0,0.55)",
      600: "rgba(0,0,0,0.68)",
      700: "rgba(0,0,0,0.75)",
      800: "rgba(0,0,0,0.85)",
      900: "rgba(0,0,0,0.91)"
    },
    whiteAlpha: {
      50: "rgba(255,255,255,0.02)",
      100: "rgba(255,255,255,0.04)",
      200: "rgba(255,255,255,0.10)",
      300: "rgba(255,255,255,0.17)",
      400: "rgba(255,255,255,0.42)",
      500: "rgba(255,255,255,0.55)",
      600: "rgba(255,255,255,0.68)",
      700: "rgba(255,255,255,0.75)",
      800: "rgba(255,255,255,0.85)",
      900: "rgba(255,255,255,0.91)"
    },
    white: "#ffffff"
  }
}

export const DEFAULT_THEME_ACCENT = basePalette.colors.yellow
export const DEFAULT_THEME_PRIMARY = basePalette.colors.purple
export const DEFAULT_THEME_SECONDARY = basePalette.colors.blackAlpha

const colors = {
  primary: DEFAULT_THEME_PRIMARY,
  secondary: DEFAULT_THEME_SECONDARY,
  accent: DEFAULT_THEME_ACCENT,

  info: basePalette.colors.cyan,
  warning: basePalette.colors.yellow,
  success: basePalette.colors.green,
  danger: basePalette.colors.red,

  ...basePalette.colors
}

export default colors
