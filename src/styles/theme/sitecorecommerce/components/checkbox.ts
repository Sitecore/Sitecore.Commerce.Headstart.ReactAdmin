import type {DeepPartial, Theme} from "@chakra-ui/react"

export const Checkbox = {
  baseStyle: {
    control: {
      borderColor: "brandButtons.500",
      bg: "brandButtons.500",
      _hover: {
        bg: "brandButtons.200",
        borderColor: "brandButtons.200"
      },
      _dark: {
        borderColor: "brandButtons.200",
        bg: "brandButtons.200",
        _hover: {
          borderColor: "brandButtons.500",
          bg: "brandButtons.500"
        }
      },
      _checked: {
        borderColor: "brandButtons.500",
        bg: "brandButtons.500",
        _hover: {
          borderColor: "brandButtons.200",
          bg: "brandButtons.200"
        },
        _dark: {
          borderColor: "brandButtons.500",
          bg: "brandButtons.500",
          _hover: "brandButtons.500"
        }
      }
    }
  }
}
