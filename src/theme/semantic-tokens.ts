import {TinyColor} from "@ctrl/tinycolor"
import basePalette from "./foundations/colors"

const utility = {
  colors: {
    "border-color-a11y": {
      default: "blackAlpha.450",
      _dark: "whiteAlpha.400"
    },
    "st.mainBackgroundColor": {
      default: "blackAlpha.100",
      _dark: "gray.900"
    },
    "st.cardBackgroundColor": {
      default: "whiteAlpha.100",
      _dark: "gray.900"
    },
    "st.tableStripeBackground": {
      default: "blackAlpha.100",
      _dark: "gray.900"
    },
    // LOGO SPECIFIC SEMANTIC TOKENS
    "st.logoBaseColor": {
      default: "gray.900",
      _dark: "gray.50"
    },
    "st.linkColor": {
      default: "primary.600",
      _dark: "primary.100"
    },
    "st.visaBackground": {
      default: "#1434CB",
      _dark: "white"
    },
    "st.visaForeground": {
      default: "white",
      _dark: "#1434CB"
    },

    "st.mastercardBackground": {
      default: "#252525",
      _dark: "white"
    },
    "st.mastercardForeground": {
      default: "#F79E1B",
      _dark: "white"
    },

    "st.amexBackground": {
      default: "#016FD0",
      _dark: "white"
    },
    "st.amexForeground": {
      default: "white",
      _dark: "#016FD0"
    },

    "st.discoverBackground": {
      default: "#231F20",
      _dark: "white"
    },
    "st.discoverForeground": {
      default: "white",
      _dark: "#231F20"
    }
  }
}

const neutral = {
  // NEUTRAL (used for colorScheme)
  // blackAlpha & whiteAlpha pairs with 'opposite' opacity levels, to work (reasonably) well as a colorScheme value.
  "neutral.50": {
    default: "blackAlpha.50",
    _dark: "whiteAlpha.900"
  },
  "neutral.100": {
    default: "blackAlpha.100",
    _dark: "whiteAlpha.800"
  },
  "neutral.200": {
    default: "blackAlpha.200",
    _dark: "whiteAlpha.700"
  },
  "neutral.300": {
    default: "blackAlpha.300",
    _dark: "whiteAlpha.600"
  },
  "neutral.400": {
    default: "blackAlpha.400",
    _dark: "whiteAlpha.500"
  },
  "neutral.500": {
    default: "blackAlpha.500",
    _dark: "whiteAlpha.400"
  },
  "neutral.600": {
    default: "blackAlpha.600",
    _dark: "whiteAlpha.300"
  },
  "neutral.700": {
    default: "blackAlpha.700",
    _dark: "whiteAlpha.200"
  },
  "neutral.800": {
    default: "blackAlpha.800",
    _dark: "whiteAlpha.100"
  },
  "neutral.900": {
    default: "blackAlpha.900",
    _dark: "whiteAlpha.50"
  },

  // NEUTRAL COLOR (used for color)
  // blackAlpha and whiteAlpha pairs with equivalent opacity levels, to work well as a color value.
  "neutral-color.50": {
    default: "blackAlpha.50",
    _dark: "whiteAlpha.100"
  },
  "neutral-color.100": {
    default: "blackAlpha.100",
    _dark: "whiteAlpha.200"
  },
  "neutral-color.200": {
    default: "blackAlpha.200",
    _dark: "whiteAlpha.300"
  },
  "neutral-color.300": {
    default: "blackAlpha.300",
    _dark: "whiteAlpha.400"
  },
  "neutral-color.400": {
    default: "blackAlpha.400",
    _dark: "whiteAlpha.500"
  },
  "neutral-color.500": {
    default: "blackAlpha.500",
    _dark: "whiteAlpha.600"
  },
  "neutral-color.600": {
    default: "blackAlpha.600",
    _dark: "whiteAlpha.700"
  },
  "neutral-color.700": {
    default: "blackAlpha.700",
    _dark: "whiteAlpha.800"
  },
  "neutral-color.800": {
    default: "blackAlpha.800",
    _dark: "whiteAlpha.900"
  },
  "neutral-color.900": {
    default: "blackAlpha.900",
    _dark: "white"
  }
}

const simple = {
  primary: {
    default: "primary.500",
    _dark: "primary.200"
  },
  danger: {
    default: "danger.500",
    _dark: "danger.200"
  },
  error: {
    default: "danger.500",
    _dark: "danger.200"
  },
  success: {
    default: "success.500",
    _dark: "success.200"
  },
  warning: {
    default: "warning.500",
    _dark: "warning.200"
  },
  info: {
    default: "info.500",
    _dark: "info.200"
  },
  neutral: {
    default: "blackAlpha.500",
    _dark: "whiteAlpha.600"
  },
  gray: {
    default: "gray.500",
    _dark: "gray.200"
  },
  red: {
    default: "red.500",
    _dark: "red.200"
  },
  orange: {
    default: "orange.500",
    _dark: "orange.200"
  },
  yellow: {
    default: "yellow.500",
    _dark: "yellow.200"
  },
  green: {
    default: "green.500",
    _dark: "green.200"
  },
  teal: {
    default: "teal.500",
    _dark: "teal.200"
  },
  cyan: {
    default: "cyan.500",
    _dark: "cyan.200"
  },
  blue: {
    default: "blue.500",
    _dark: "blue.200"
  },
  purple: {
    default: "purple.500",
    _dark: "purple.200"
  },
  pink: {
    default: "pink.500",
    _dark: "pink.200"
  }
}

const foreground = {
  // For button labels, links, and text
  "primary-fg": {
    default: "primary.600",
    _dark: "primary.200"
  },
  "danger-fg": {
    default: "danger.600",
    _dark: "danger.200"
  },
  "warning-fg": {
    default: "warning.600",
    _dark: "warning.200"
  },
  "success-fg": {
    default: "success.600",
    _dark: "success.200"
  },
  "info-fg": {
    default: "info.600",
    _dark: "info.200"
  },
  "neutral-fg": {
    default: "blackAlpha.600",
    _dark: "whiteAlpha.700"
  }
}

const subtleBg = {
  "primary-subtle-bg": {
    default: "primary.100",
    _dark: new TinyColor(basePalette.primary[200]).setAlpha(0.16).toRgbString()
  },
  "danger-subtle-bg": {
    default: "danger.100",
    _dark: new TinyColor(basePalette.danger[200]).setAlpha(0.16).toRgbString()
  },
  "error-subtle-bg": {
    default: "danger.100",
    _dark: new TinyColor(basePalette.danger[200]).setAlpha(0.16).toRgbString()
  },
  "warning-subtle-bg": {
    default: "warning.100",
    _dark: new TinyColor(basePalette.warning[200]).setAlpha(0.16).toRgbString()
  },
  "success-subtle-bg": {
    default: "success.100",
    _dark: new TinyColor(basePalette.success[200]).setAlpha(0.16).toRgbString()
  },
  "info-subtle-bg": {
    default: "info.100",
    _dark: new TinyColor(basePalette.info[200]).setAlpha(0.16).toRgbString()
  },
  "neutral-subtle-bg": {
    default: "neutral.100",
    _dark: "whiteAlpha.200"
  }
}

export const semanticTokens = {
  colors: {
    "chakra-body-bg": {
      default: "white",
      _light: "white",
      _dark: "gray.800"
    },
    "chakra-subtle-bg": {
      default: "gray.50",
      _light: "gray.50",
      _dark: "gray.700"
    },
    "chakra-body-text": {
      default: "blackAlpha.900",
      _light: "blackAlpha.900",
      _dark: "white"
    },
    "chakra-subtle-text": {
      default: "blackAlpha.500",
      _light: "blackAlpha.500",
      _dark: "whiteAlpha.600"
    },
    "chakra-placeholder-color": {
      default: "blackAlpha.400",
      _light: "blackAlpha.400",
      _dark: "whiteAlpha.500"
    },
    "chakra-inverse-text": {
      default: "white",
      _light: "white",
      _dark: "blackAlpha.900"
    },
    "chakra-border-color": {
      default: "blackAlpha.200",
      _light: "blackAlpha.200",
      _dark: "whiteAlpha.300"
    },
    ...utility,
    ...foreground,
    ...subtleBg,
    ...simple,
    ...neutral
  }
}

export default semanticTokens
