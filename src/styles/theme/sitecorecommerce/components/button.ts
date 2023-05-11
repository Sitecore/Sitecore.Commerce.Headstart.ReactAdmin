export const Button = {
  baseStyle: {
    fontWeight: "normal",
    ".chakra-button__group[data-attached][data-orientation=horizontal] > &:not(:last-of-type)": {
      borderRight: 0
    }
  },
  // Three Variants are identified : Primary, Secondary and Tertiary
  variants: {
    primaryButton: {
      fontSize: "sm",
      color: "PrimaryButtonText",
      bgColor: "PrimaryButtonBG",
      borderColor: "PrimaryButtonOutline"
    },
    secondaryButton: {
      fontSize: "sm",
      border: "1px solid",
      borderColor: "gray.300",
      bgColor: "white",
      color: "black",
      _hover: {
        bgColor: "gray.100"
      },
      _active: {
        bgColor: "gray.200"
      },
      _dark: {
        border: "1px solid",
        borderColor: "gray.300",
        bgColor: "gray.800",
        color: "white"
      }
    },
    tertiaryButton: {
      fontSize: "sm",
      border: "1px solid",
      borderColor: "gray.300",
      bgColor: "bodyBg",
      color: "black",
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
  }
}
