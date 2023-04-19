import {inputAnatomy as parts} from "@chakra-ui/anatomy"
import { theme } from "@chakra-ui/react"
import {createMultiStyleConfigHelpers} from "@chakra-ui/styled-system"

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  field: {
    _focusVisible:{
      borderColor: "purple.300",
      boxShadow: `0 0 0 2px ${theme.colors.purple[300]}`
    },
    _focus:{
      borderColor: "purple.300",
      boxShadow: `0 0 0 2px ${theme.colors.purple[300]}`
    },
    _focusWithin:{
      borderColor: "purple.300",
      boxShadow: `0 0 0 2px ${theme.colors.purple[300]}`
    }
  },
})

export const Input = defineMultiStyleConfig({
  baseStyle,
})
