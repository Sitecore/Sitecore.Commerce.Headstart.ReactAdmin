import { ChakraProvider, extendTheme, localStorageManager, theme, withDefaultColorScheme } from "@chakra-ui/react"
import React, { useState } from "react"
import contextualColors from "styles/theme/contextualColors"
import { DEFAULT_THEME_BRAND, DEFAULT_THEME_PRIMARY, DEFAULT_THEME_SECONDARY } from "theme/foundations/colors"
import schraTheme from "theme/theme"

interface ChakraProps {
  children: React.ReactNode
}
interface IBrandContext {
  colors?: {
    brand: string;
    primary: string;
    secondary: string;
  }
  setColors?: (newColors: any) => void;
}

export const brandContext = React.createContext<IBrandContext>({})

export const Chakra = ({ children }: ChakraProps) => {

  const [colors, setColors] = useState({ brand: DEFAULT_THEME_BRAND[500], primary: DEFAULT_THEME_PRIMARY[500], secondary: DEFAULT_THEME_SECONDARY[500] })

  return (
    <brandContext.Provider value={{ colors, setColors }}>
      <ChakraProvider colorModeManager={localStorageManager} theme={schraTheme}>
        {children}
      </ChakraProvider>
    </brandContext.Provider>
  )
}
