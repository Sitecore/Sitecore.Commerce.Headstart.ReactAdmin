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
    "st.logoBaseColor":{
      default: "gray.900",
      _dark: "gray.50"
    },
  }
}

export default semanticTokens
