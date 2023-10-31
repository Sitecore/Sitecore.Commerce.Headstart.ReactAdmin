import {tagAnatomy as parts} from "@chakra-ui/anatomy"
import {createMultiStyleConfigHelpers, defineStyle} from "@chakra-ui/styled-system"

const {defineMultiStyleConfig, definePartsStyle} = createMultiStyleConfigHelpers(parts.keys)

const baseStyleContainer = defineStyle({
  borderRadius: "sm",
  textTransform: "upperCase"
})

const baseStyle = definePartsStyle({
  container: baseStyleContainer
})

export const Tag = defineMultiStyleConfig({
  baseStyle
})
