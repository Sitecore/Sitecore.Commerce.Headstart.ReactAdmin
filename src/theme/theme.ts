import {extendTheme} from "@chakra-ui/react"
import foundations from "./foundations/index"
import components from "./components/index"
import styles from "./styles"
import layerStyles from "./layer-styles"
import semanticTokens from "./semantic-tokens"

const schraTheme = extendTheme({
  config: {
    initialColorMode: "system",
    useSystemColorMode: true,
    cssVarPrefix: "schra"
  },
  ...foundations,
  components,
  styles,
  layerStyles,
  semanticTokens
})

export default schraTheme
