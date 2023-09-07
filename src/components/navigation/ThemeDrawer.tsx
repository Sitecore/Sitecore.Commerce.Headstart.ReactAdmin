import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Switch,
  useColorMode,
  useColorModeValue,
  useModalContext
} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import {useContext, useState} from "react"
import Cookies from "universal-cookie"
import ProtectedContent from "../auth/ProtectedContent"
import {ColorPicker} from "../branding/ColorPicker"
import FontPicker from "../branding/FontPicker"
import {brandContext, DEFAULT_THEME_COLORS} from "../Chakra"

export const ThemeDrawer = () => {
  const {colors, setColors, fonts, setFonts} = useContext(brandContext)
  const [selectedColors, setSelectedColors] = useState(colors)
  const [selectedFonts, setSelectedFonts] = useState(fonts)

  const {colorMode, toggleColorMode} = useColorMode()
  const {onClose} = useModalContext()
  const handleColorChange = (colorID: string, newValue: any) => {
    setSelectedColors((c) => ({...c, [colorID]: newValue}))
  }

  const [currentColorMode, setCurrentColorMode] = useState(colorMode)

  const handleChangeColorMode = () => {
    setCurrentColorMode((c) => (c === "light" ? "dark" : "light"))
    setTimeout(() => {
      toggleColorMode()
    }, 100)
  }
  const handleFontChange = (fontKey: string, newValue: any) => {
    setSelectedFonts((f) => ({...f, [fontKey]: newValue}))
  }

  const handleApplyTheme = () => {
    setColors(selectedColors)
    setFonts(selectedFonts)
    onClose()
  }

  const handleResetTheme = () => {
    setColors(DEFAULT_THEME_COLORS)
    setFonts(undefined)
    onClose()
  }

  const color = useColorModeValue("textColor.900", "textColor.100")
  // This function is triggered when the select changes
  const cookies = new Cookies()
  let currenttheme
  if (cookies.get("currenttheme") !== null) {
    currenttheme = cookies.get("currenttheme")
  }
  return (
    <>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader color={color}>Theming</DrawerHeader>
        <DrawerBody color={color} display="flex" flexFlow="column nowrap" gap={6}>
          <ProtectedContent hasAccess={appPermissions.ProfileManager}>
            <FormControl display="flex" gap={4}>
              <Switch
                isChecked={currentColorMode === "dark"}
                onChange={handleChangeColorMode}
                colorScheme={"primary"}
                id="toggleColorMode"
                size="lg"
              />
              <FormLabel htmlFor="toggleColorMode">Toggle {colorMode} mode</FormLabel>
            </FormControl>
          </ProtectedContent>
          <Divider />
          <ColorPicker colors={selectedColors} onChange={handleColorChange} />
          <FontPicker fonts={selectedFonts} onChange={handleFontChange} />
        </DrawerBody>
        <DrawerFooter gap={4} flexFlow="row wrap" justifyContent="center" alignItems={"center"}>
          <Button variant="solid" colorScheme="primary" onClick={handleApplyTheme} flexGrow={1}>
            Apply Theming
          </Button>

          <Button onClick={handleResetTheme} variant="outline" colorScheme="danger" inset="unset">
            Reset
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </>
  )
}
