import {menuAnatomy} from "@chakra-ui/anatomy"
import {createMultiStyleConfigHelpers} from "@chakra-ui/react"

const {definePartsStyle, defineMultiStyleConfig} = createMultiStyleConfigHelpers(menuAnatomy.keys)

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  button: {
    lineHeight: 0
  }
})

// export the component theme
export const Menu = defineMultiStyleConfig({
  baseStyle
})
