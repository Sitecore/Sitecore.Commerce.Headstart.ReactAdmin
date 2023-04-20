import {
  Button,
  ButtonGroup,
  Divider,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Icon,
  MenuItem,
  Switch,
  useColorMode,
  useColorModeValue,
  useModalContext
} from "@chakra-ui/react"
import React, {useContext, useState} from "react"
import Cookies from "universal-cookie"
import {ColorPicker} from "../branding/ColorPicker"
import {LogoUploader} from "../branding/LogoUploader"
import {FontUploader} from "../branding/FontUploader"
import {brandContext, DEFAULT_THEME_COLORS} from "../Chakra"
import {DEFAULT_THEME_ACCENT, DEFAULT_THEME_PRIMARY, DEFAULT_THEME_SECONDARY} from "theme/foundations/colors"
import {appPermissions} from "constants/app-permissions.config"
import {TbSun, TbMoon} from "react-icons/tb"
import ProtectedContent from "../auth/ProtectedContent"

export const ThemeDrawer = () => {
  const {colors, setColors} = useContext(brandContext)
  const [selectedColors, setSelectedColors] = useState(colors)
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

  const handleApplyTheme = () => {
    setColors(selectedColors)
    onClose()
  }

  const handleResetTheme = () => {
    localStorage.removeItem("themeColors")
    setColors(DEFAULT_THEME_COLORS)
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
          <ProtectedContent hasAccess={appPermissions.MeManager}>
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
          {/* <LogoUploader />
              <FontUploader /> */}
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
