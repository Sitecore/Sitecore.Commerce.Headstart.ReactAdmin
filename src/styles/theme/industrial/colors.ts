import type {DeepPartial, Theme} from "@chakra-ui/react"

/** extend additional color here */
const extendedColors: DeepPartial<Record<string, Theme["colors"]["blackAlpha"]>> = {
  brand: {
    // Grayscale
    100: "white",
    200: "#E2E8F0",
    300: "#CBD5E0",
    400: "#A0AEC0",
    500: "#718096",
    600: "#4A5568",
    700: "#2D3748",
    800: "#1A202C",
    900: "black"
  },
  brandButtons: {
    // Grayscale
    100: "white",
    200: "#A0AEC0",
    300: "#CBD5E0",
    400: "#A0AEC0",
    500: "#718096",
    600: "#4A5568",
    700: "#2D3748",
    800: "#1A202C",
    900: "black"
  },
  boxTextColor: {
    100: "white",
    200: "#E2E8F0",
    300: "#CBD5E0",
    400: "#A0AEC0",
    500: "#718096",
    600: "#4A5568",
    700: "#2D3748",
    800: "#1A202C",
    900: "black"
  },
  boxBgColor: {
    100: "white",
    200: "#E2E8F0",
    300: "#CBD5E0",
    400: "#A0AEC0",
    500: "#718096",
    600: "#4A5568",
    700: "#2D3748",
    800: "#1A202C",
    900: "black"
  },
  textColor: {
    100: "white",
    200: "#E2E8F0",
    300: "#CBD5E0",
    400: "#A0AEC0",
    500: "#718096",
    600: "#4A5568",
    700: "#2D3748",
    800: "#1A202C",
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
