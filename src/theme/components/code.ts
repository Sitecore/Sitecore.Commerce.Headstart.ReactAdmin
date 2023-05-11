import {defineStyle, defineStyleConfig} from "@chakra-ui/styled-system"

const baseStyle = defineStyle({
  px: "0.6em",
  borderRadius: "md",
  mx: ".75ch"
})

const codeTheme = defineStyleConfig({
  baseStyle
})

const Code = {
  ...codeTheme
}

export default Code
