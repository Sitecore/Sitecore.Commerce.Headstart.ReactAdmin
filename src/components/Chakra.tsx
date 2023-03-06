import {ChakraProvider, localStorageManager} from "@chakra-ui/react"

import sitecorecommerceTheme from "styles/theme/sitecorecommerce/"
import playsummitTheme from "styles/theme/playsummit/"
import industrialTheme from "styles/theme/industrial/"
import Cookies from "universal-cookie"

interface ChakraProps {
  children: React.ReactNode
}

export const Chakra = ({children}: ChakraProps) => {
  const cookies = new Cookies()
  let currenttheme
  if (cookies.get("currenttheme") === undefined) {
    cookies.set("currenttheme", "styles/theme/sitecorecommerce/", {
      path: "/"
    })
  }
  if (cookies.get("currenttheme") === "styles/theme/sitecorecommerce/") {
    currenttheme = sitecorecommerceTheme
  }
  if (cookies.get("currenttheme") === "styles/theme/playsummit/") {
    currenttheme = playsummitTheme
  }
  if (cookies.get("currenttheme") === "styles/theme/industrial/") {
    currenttheme = industrialTheme
  }
  return (
    <ChakraProvider colorModeManager={localStorageManager} theme={currenttheme}>
      {children}
    </ChakraProvider>
  )
}
