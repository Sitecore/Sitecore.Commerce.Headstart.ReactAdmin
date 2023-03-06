import {extendTheme} from "@chakra-ui/react"

import {colors} from "./colors"
import {components} from "./components"
import {config} from "./config"
import {fonts} from "./fonts"
import {mode} from "@chakra-ui/theme-tools"
import type {StyleFunctionProps} from "@chakra-ui/styled-system"

// import { layouts } from "./layouts";

const customTheme = extendTheme({
  fonts,
  colors,
  config,
  components,
  styles: {
    global: (props: StyleFunctionProps) => ({
      // styles for the `body`
      body: {
        bg: mode("gray.200", "gray.800")(props),
        color: "white"
      }
    })
  }
  // layouts,
})

export default customTheme
