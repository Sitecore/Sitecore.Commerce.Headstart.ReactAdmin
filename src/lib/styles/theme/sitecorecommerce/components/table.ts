export const Table = {
  // The styles all cards have in common
  baseStyle: {
    fontWeight: "regular",
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
    primaryTable: {
      p: "28px 10px 0px 0px",
      my: {sm: "26px", lg: "26px"},
      _dark: {
        border: "1px solid",
        borderColor: "gray.300",
        bgColor: "gray.800",
        color: "white"
      }
    },
    secondaryTable: {
      p: "28px 10px 0px 0px",
      y: {sm: "26px", lg: "0px"}
    },
    tertiaryTable: {
      p: "28px 10px 0px 0px",
      my: {sm: "26px", lg: "0px"}
    }
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "primaryTable"
  }
}
