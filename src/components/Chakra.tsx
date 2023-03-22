import {ChakraProvider, extendTheme, localStorageManager, theme, withDefaultColorScheme} from "@chakra-ui/react"
import contextualColors from "styles/theme/contextualColors"
import Card from "styles/theme/components/card"

interface ChakraProps {
  children: React.ReactNode
}

const variantOutlined = (colors) => ({
  field: {
    _focus: {
      borderColor: colors.brand[500],
      boxShadow: `0 0 0 1px ${colors.brand[500]}`
    }
  }
})

const variantFilled = (colors) => ({
  field: {
    _focus: {
      borderColor: colors.brand[500],
      boxShadow: `0 0 0 1px ${colors.brand[500]}`
    }
  }
})

const variantFlushed = (colors) => ({
  field: {
    _focus: {
      borderColor: colors.brand[500],
      boxShadow: `0 1px 0 0 ${colors.brand[500]}`
    }
  }
})

const colors = {
  ...theme.colors,
  ...contextualColors
}

const customTheme = extendTheme(
  {
    colors,
    components: {
      Card,
      Input: {
        variants: {
          outline: variantOutlined(colors),
          filled: variantFilled(colors),
          flushed: variantFlushed(colors)
        }
      },
      Select: {
        variants: {
          outline: variantOutlined(colors),
          filled: variantFilled(colors),
          flushed: variantFlushed(colors)
        }
      },
      Textarea: {
        variants: {
          outline: () => variantOutlined(colors).field,
          filled: () => variantFilled(colors).field,
          flushed: () => variantFlushed(colors).field
        }
      }
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
