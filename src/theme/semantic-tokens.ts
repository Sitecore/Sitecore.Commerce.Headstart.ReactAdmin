// prepend your semantic token with "st."

// q: why are there duplicates?
// a: there's no validation, so if you accidentally capitalize, you might not realize the error.
//    duplicating with both case sensitivity to aleviate.

const semanticTokens = {
  colors: {
    "st.borderColor": {
      default: "blackAlpha.300",
      _dark: "whiteAlpha.300"
    },
    "st.BorderColor": {
      default: "blackAlpha.300",
      _dark: "whiteAlpha.300"
    },
    "st.mainBackgroundColor": {
      default: "blackAlpha.100",
      _dark: "gray.900"
    },
    "st.MainBackgroundColor": {
      default: "blackAlpha.50",
      _dark: "gray.900"
    },
    "st.cardBackgroundColor": {
      default: "whiteAlpha.100",
      _dark: "gray.900"
    },
    "st.CardBackgroundColor": {
      default: "whiteAlpha.100",
      _dark: "gray.900"
    },
    "st.tableStripeBackground": {
      default: "blackAlpha.100",
      _dark: "gray.900"
    },
    "st.TableStripeBackground": {
      default: "whiteAlpha.100",
      _dark: "gray.900"
    },
    // LOGO SPECIFIC SEMANTIC TOKENS
    "st.logoBaseColor": {
      default: "gray.900",
      _dark: "gray.50"
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

export default semanticTokens
