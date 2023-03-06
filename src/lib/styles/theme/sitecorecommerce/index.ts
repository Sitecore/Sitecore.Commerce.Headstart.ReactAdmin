import {extendTheme, withDefaultColorScheme} from "@chakra-ui/react"
import {globalColors} from "./colors"
import {config} from "./config"
import {fonts} from "./fonts"
import {semanticTokens} from "./tokens"
import {styles} from "./styles"
import {breakpoints} from "./foundations/breakpoints"
import {Button} from "./components/button"
import {Button as IconButton} from "./components/button"
import {Badge} from "./components/badge"
import {Link} from "./components/link"
import {Input} from "./components/input"
import {Input as Textarea} from "./components/input"
import {Card} from "./components/card"

export default extendTheme(
  {
    fonts,
    colors: globalColors,
    config,
    breakpoints, // Breakpoints
    semanticTokens,
    styles,
    components: {
      Card, // Card component
      Link, // Link styles
      Badge, // Badge styles
      Button, // Button styles
      IconButton, // IconButton styles
      Input, // Input styles
      Textarea
    }
  },
  withDefaultColorScheme({colorScheme: "brand", components: ["Switch"]})
)
