import {cardAnatomy} from "@chakra-ui/anatomy"
import {createMultiStyleConfigHelpers} from "@chakra-ui/react"
import {mode} from "@chakra-ui/theme-tools"
const {definePartsStyle, defineMultiStyleConfig} = createMultiStyleConfigHelpers(cardAnatomy.keys)

const baseStyle = (props) =>
  definePartsStyle({
    container: {
      borderRadius: "md",
      backgroundColor: mode("white", "whiteAlpha.100")(props)
    }
  })

const variants = {
  levitating: (props) =>
    definePartsStyle({
      header: {
        textTransform: "capitalize"
      },
      container: {
        transition: "all .25s ease-in-out",
        boxShadow: "md",
        textDecoration: "none",
        border: `.5px solid transparent`,
        _hover: {
          borderColor: "chakra-border-color",
          boxShadow: "lg",
          transform: "translateY(-1px)",
          textDecoration: "none"
        },
        _focusWithin: {zIndex: 1, transform: "translateY(-1px)"},
        _focusVisible: {zIndex: 1, transform: "translateY(-1px)"}
      }
    })
}

export const Card = defineMultiStyleConfig({baseStyle, variants})
