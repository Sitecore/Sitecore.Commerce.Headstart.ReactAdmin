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
      50: "#F2E9FB",
      100: "#DCC2F5",
      200: "#C59BEE",
      300: "#AF74E7",
      400: "#984CE0",
      500: "#8225DA",
      600: "#681EAE",
      700: "#4E1683",
      800: "#340F57",
      900: "#1A072C"
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
      50: "#FEFBE7",
      100: "#FCF5BA",
      200: "#FAEE8E",
      300: "#F9E762",
      400: "#F7E136",
      500: "#F5DA0A",
      600: "#C4AF08",
      700: "#938306",
      800: "#625704",
      900: "#312C02"
    },
    gray: {
      50: "#F4F2F1",
      100: "#E0DBD7",
      200: "#CCC4BD",
      300: "#B8ADA3",
      400: "#A49689",
      500: "#90806F",
      600: "#736659",
      700: "#564D43",
      800: "#39332D",
      900: "#1D1A16"
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

const colors = {
  brand: basePalette.colors.teal,
  primary: basePalette.colors.teal,
  secondary: basePalette.colors.gray,

  info: basePalette.colors.cyan,
  warning: basePalette.colors.yellow,
  success: basePalette.colors.green,
  danger: basePalette.colors.red,

  ...basePalette.colors
}

export default colors
