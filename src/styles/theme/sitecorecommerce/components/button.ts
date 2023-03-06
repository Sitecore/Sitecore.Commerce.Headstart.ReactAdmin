export const Button = {
  // The styles all button have in common
  baseStyle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    borderRadius: "full"
  },
  // Three sizes: sm, md and lg
  sizes: {
    sm: {
      fontSize: "sm",
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3 // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: "md",
      px: 6, // <-- these values are tokens from the design system
      py: 4 // <-- these values are tokens from the design system
    },
    lg: {
      fontSize: "lg",
      px: 8, // <-- these values are tokens from the design system
      py: 6 // <-- these values are tokens from the design system
    }
  },
  // Three Variants are identified : Primary, Secondary and Tertiary
  variants: {
    primaryButton: {
      color: "PrimaryButtonText",
      bgColor: "PrimaryButtonBG",
      borderRadius: "md",
      fontSize: "12px",
      fontWeight: "normal",
      borderColor: "PrimaryButtonOutline"
    },
    secondaryButton: {
      border: "1px solid",
      borderColor: "gray.300",
      bgColor: "white",
      color: "black",
      borderRadius: "md",
      fontSize: "12px",
      fontWeight: "normal",
      _dark: {
        border: "1px solid",
        borderColor: "gray.300",
        bgColor: "gray.800",
        color: "white"
      }
    },
    tertiaryButton: {
      border: "1px solid",
      borderColor: "gray.300",
      bgColor: "bodyBg",
      color: "black",
      borderRadius: "md",
      fontSize: "12px",
      fontWeight: "normal",
      _dark: {
        border: "1px solid",
        borderColor: "gray.300",
        bgColor: "gray.800",
        color: "white"
      }
    },
    closePanelButton: {
      borderColor: "gray.200",
      border: "1px",
      color: "gray.200",
      borderRadius: "50%",
      position: "absolute",
      right: "10px",
      top: "10px",
      minWidth: "30px",
      width: "30px",
      minHeight: "30px",
      height: "30px"
    }
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "primaryButton"
  }
}
