const styles = {
  global: {
    ".my-commerce-logo_accent": {
      fill: "accent.400"
    },
    ".my-commerce-logo_primary": {
      fill: "primary.400"
    },
    ".my-commerce-logo_primary-alt": {
      fill: "primary.900"
    },
    ".my-commerce-logo_dark": {
      fill: "st.logoBaseColor"
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
