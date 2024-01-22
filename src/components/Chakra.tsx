import {ChakraProvider, extendTheme, localStorageManager} from "@chakra-ui/react"
import {appSettings} from "config/app-settings"
import useLocalStorage from "hooks/useLocalStorage"
import Head from "next/head"
import React, {useMemo} from "react"
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
  accent: appSettings.themeColorAccent,
  primary: appSettings.themeColorPrimary,
  secondary: appSettings.themeColorSecondary
}

export const Chakra = ({children}: ChakraProps) => {
  const [colors, setColors] = useLocalStorage("themeColors", DEFAULT_THEME_COLORS)
  const [fonts, setFonts] = useLocalStorage(
    "themeFonts",
    appSettings.themeFontHeading || appSettings.themeFontBody
      ? {heading: appSettings.themeFontHeading, body: appSettings.themeFontBody}
      : undefined
  )

  const currentTheme = useMemo(() => {
    let updatedColors = {
      accent: generatePalette(colors?.accent),
      primary: generatePalette(colors?.primary),
      secondary: generatePalette(colors?.secondary)
    }

    let updatedFonts
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
            {fonts.heading && <link href={buildFontHref(fonts.heading)} rel="stylesheet" />}
            {fonts.body && <link href={buildFontHref(fonts.body)} rel="stylesheet" />}
          </Head>
        )}
        {children}
      </ChakraProvider>
    </brandContext.Provider>
  )
}
