import {
    Button,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    useColorModeValue,
} from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import Cookies from "universal-cookie"
import { ColorPicker } from "../branding/ColorPicker";
import { LogoUploader } from "../branding/LogoUploader";
import { FontUploader } from "../branding/FontUploader";
import { brandContext } from "../Chakra";

export const ThemeDrawer = () => {

    const { colors, setColors } = useContext(brandContext)
    const [selectedColors, setSelectedColors] = useState(colors)

    const handleColorChange = (colorID: string, newValue: any) => {
        setSelectedColors((c) => ({ ...c, [colorID]: newValue }))
    }


    const handleApplyTheme = () => {
        setColors(selectedColors)
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
                <DrawerHeader color={color}>Theming</DrawerHeader>
                <DrawerBody color={color} display="flex" flexFlow="column nowrap" gap={6}>
                    <ColorPicker colors={selectedColors} onChange={handleColorChange} />
                    {/* <LogoUploader />
                    <FontUploader /> */}
                </DrawerBody>
                <DrawerFooter gap={4} justifyContent="center" alignItems={"center"}>
                    <Button flexGrow="1" variant="solid" size="sm" colorScheme="primary" onClick={handleApplyTheme}>Apply Theming</Button>
                    <Button as={DrawerCloseButton} variant="outline" size="sm" inset="unset" flex="auto">Discard</Button>
                </DrawerFooter>
            </DrawerContent>
        </>
    )
}