import {ChakraProvider, extendTheme, localStorageManager, theme, withDefaultColorScheme} from "@chakra-ui/react"
import contextualColors from "styles/theme/contextualColors"
import Card from "../styles/theme/components/Card"
import {Input, Select, Textarea} from "../styles/theme/components/Controls"

interface ChakraProps {
  children: React.ReactNode
}

const colors = {
  ...theme.colors,
  ...contextualColors
}

const customTheme = extendTheme(
  {
    colors,
    components: {
      Card,
      Input: Input(colors),
      Select: Select(colors),
      Textarea: Textarea(colors)
    },
    space: {
      formInputSpacing: "1.25rem",
      formSectionSpacing: "2.5rem"
    }
  },
  withDefaultColorScheme({
    colorScheme: "brand",
    components: ["Checkbox", "RangeSlider", "Radio", "PinInput", "Select", "Slider", "Switch", "TextArea", "Input"]
  })
)

export const Chakra = ({children}: ChakraProps) => {
  return (
    <ChakraProvider colorModeManager={localStorageManager} theme={customTheme}>
      {children}
    </ChakraProvider>
  )
}
