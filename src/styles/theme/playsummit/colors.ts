import type {DeepPartial, Theme} from "@chakra-ui/react"

/** extend additional color here */
const extendedColors: DeepPartial<Record<string, Theme["colors"]["blackAlpha"]>> = {
  brand: {
    // Blue
    100: "#1c80ff",
    200: "#1c80ff",
    300: "#1c80ff",
    400: "#1c80ff",
    500: "#1c80ff",
    600: "#1c80ff",
    700: "#1c80ff",
    800: "#1c80ff",
    900: "#1c80ff"
  },
  brandButtons: {
    // Blue
    100: "#1c80ff",
    200: "#1c80ff",
    300: "#1c80ff",
    400: "#1c80ff",
    500: "#1c80ff",
    600: "#1c80ff",
    700: "#1c80ff",
    800: "#1c80ff",
    900: "#1c80ff"
  },
  boxTextColor: {
    100: "white",
    900: "black"
  },
  boxBgColor: {
    // Blue
    100: "#1c80ff",
    200: "#1c80ff",
    300: "#1c80ff",
    400: "#1c80ff",
    500: "#1c80ff",
    600: "#1c80ff",
    700: "#1c80ff",
    800: "#1c80ff",
    900: "#1c80ff"
  },
  textColor: {
    100: "white",
    900: "black"
  },
  okColor: {
    200: "#9AE6B4",
    800: "#22543D"
  },
  errorColor: {
    200: "#FEB2B2",
    800: "#822727"
  },
  headerBg: {
    500: "white",
    900: "#4A5568"
  },
  footerBg: {
    400: "#A0AEC0",
    600: "#4A5568"
  },
  tileBg: {
    500: "white",
    900: "#4A5568"
  }
}

/** override chakra colors here */
const overridenChakraColors: DeepPartial<Theme["colors"]> = {}

export const colors = {
  ...overridenChakraColors,
  ...extendedColors
}
