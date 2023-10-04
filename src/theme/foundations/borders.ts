import {getColor} from "@chakra-ui/theme-tools"
import {theme as defaultTheme} from "@chakra-ui/theme"
import {getToken} from "@chakra-ui/react"

const borderColor = getColor(defaultTheme, "blackAlpha.300", "gray")

const borders = {
  default: `1px solid ${borderColor}`
}

export default borders
