import {ChakraProvider, extendTheme, localStorageManager} from "@chakra-ui/react"
import useLocalStorage from "hooks/useLocalStorage"
import Head from "next/head"
import React, {useMemo} from "react"
import {DEFAULT_THEME_ACCENT, DEFAULT_THEME_PRIMARY, DEFAULT_THEME_SECONDARY} from "theme/foundations/colors"
import schraTheme from "theme/theme"
import {generatePalette} from "utils"
import {buildFontHref} from "../utils/font.utils"

interface ChakraProps {
  children: React.ReactNode
}
interface IBrandContext {
  colors?: {
    accent: string
    primary: string
    secondary: string
  }
  fonts?: {
    heading: string
    body: string
  }
  setFonts?: (newFonts: any) => void
  setColors?: (newColors: any) => void
}

export const brandContext = React.createContext<IBrandContext>({})

export const DEFAULT_THEME_COLORS = {
  accent: DEFAULT_THEME_ACCENT[500],
  primary: DEFAULT_THEME_PRIMARY[500],
  secondary: DEFAULT_THEME_SECONDARY[500]
}

export const Chakra = ({children}: ChakraProps) => {
  const [colors, setColors] = useLocalStorage("themeColors", DEFAULT_THEME_COLORS)
  const [fonts, setFonts] = useLocalStorage("themeFonts", undefined)

  const currentTheme = useMemo(() => {
    let updatedColors, updatedFonts
    if (colors !== DEFAULT_THEME_COLORS) {
      updatedColors = {
        accent: generatePalette(colors?.accent),
        primary: generatePalette(colors?.primary),
        secondary: generatePalette(colors?.secondary)
      }
    }
    if (fonts !== undefined) {
      updatedFonts = {
        heading: fonts.heading,
        body: fonts.body
      }
    }
    return extendTheme(
      {
        colors: updatedColors,
        fonts: updatedFonts
      },
      schraTheme
    )
  }, [colors, fonts])

  return (
    <brandContext.Provider value={{colors, setColors, fonts, setFonts}}>
      <ChakraProvider colorModeManager={localStorageManager} theme={currentTheme}>
        {fonts && (
          <Head>
            <link href={buildFontHref(fonts.heading)} rel="stylesheet" />
            <link href={buildFontHref(fonts.body)} rel="stylesheet" />
          </Head>
        )}
        {children}
      </ChakraProvider>
    </brandContext.Provider>
  )
}
