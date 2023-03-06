import {border} from "@chakra-ui/react"

export const Input = {
  baseStyle: {
    field: {
      fontWeight: 400,
      borderRadius: "md",
      border: "1px solid"
    },
    addon: {
      border: "1px solid",
      borderColor: "gray.200",
      background: "gray.200",
      borderRadius: "full",
      color: "gray.500",

      _dark: {
        borderColor: "gray.600",
        background: "gray.600",
        color: "gray.400"
      }
    }
  },

  variants: {
    primaryInput: {
      // Need both root and field for Text Area and Input to style
      bg: "inputBg",
      border: "1px",
      borderColor: "gray.200",
      mb: "GlobalPadding",
      field: {
        bg: "inputBg",
        border: "1px"
      },
      _readonly: {
        border: "1px"
      }
    },
    auth: {
      field: {
        bg: "inputBg",
        border: "1px solid",
        borderColor: "gray.200",
        _placeholder: "gray.300"
      }
    },
    search: {
      field: {
        border: "1px",
        borderColor: "gray.200",
        py: "11px",
        borderRadius: "inherit",
        _placeholder: "gray.300"
      }
    }
  },
  defaultProps: {
    variant: "primaryInput"
  }
}
