const styles = {
  global: {
    ".my-commerce-icon_accent": {
      fill: "accent.400"
    },
    ".my-commerce-icon_primary": {
      fill: "primary.400"
    },
    ".my-commerce-icon_primary-alt": {
      fill: "primary.900"
    },
    ".my-commerce-icon_dark": {
      fill: "st.logoBaseColor"
    },
    ".visa-logo-background": {
      fill: "st.visaBackground"
    },
    ".visa-logo-foreground": {
      fill: "st.visaForeground"
    },
    ".mastercard-logo-background": {
      fill: "st.mastercardBackground"
    },
    ".amex-logo-background": {
      fill: "st.amexBackground"
    },
    ".amex-logo-foreground": {
      fill: "st.amexForeground"
    },
    ".discover-logo-background": {
      fill: "st.discoverBackground"
    },
    ".discover-logo-foreground": {
      fill: "st.discoverForeground"
    },
    body: {
      fontSize: "md",
      "& #__next": {
        display: "flex",
        flexFlow: "column nowrap",
        minHeight: "100vh",
        transition: "0.5s ease-out",
        width: "100%"
      }
    }
  }
}

export default styles
