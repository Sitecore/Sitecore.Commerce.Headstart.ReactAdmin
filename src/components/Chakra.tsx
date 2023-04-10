import { ChakraProvider, extendTheme, localStorageManager, theme, withDefaultColorScheme } from "@chakra-ui/react"
import contextualColors from "styles/theme/contextualColors"
import schraTheme from "theme/theme"
// import Card from "../styles/theme/components/Card"
import { Input, Select, Textarea } from "../styles/theme/components/Controls"

interface ChakraProps {
  children: React.ReactNode
}

// const colors = {
//   ...theme.colors,
//   ...contextualColors
// }

// const customTheme = extendTheme(
//   {
//     components: {
//       Input: Input(colors),
//       Select: Select(colors),
//       Textarea: Textarea(colors)
//     },
//   },
//   withDefaultColorScheme({
//     colorScheme: "brand",
//     components: ["Checkbox", "RangeSlider", "Radio", "PinInput", "Select", "Slider", "Switch", "TextArea", "Input"]
//   })
// )

export const Chakra = ({ children }: ChakraProps) => {
  return (
    <ChakraProvider colorModeManager={localStorageManager} theme={schraTheme}>
      {children}
    </ChakraProvider>
  )
}
