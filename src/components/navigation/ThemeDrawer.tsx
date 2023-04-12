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
import React from "react"
import Cookies from "universal-cookie"
import { ColorPicker } from "../branding/ColorPicker";
import { LogoUploader } from "../branding/LogoUploader";
import { FontUploader } from "../branding/FontUploader";

export const ThemeDrawer = () => {

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
                    <ColorPicker />
                    <LogoUploader />
                    <FontUploader />
                </DrawerBody>
                <DrawerFooter gap={4} justifyContent="center" alignItems={"center"}>
                    <Button flexGrow="1" variant="solid" size="sm" colorScheme="primary">Apply Theming</Button>
                    <Button as={DrawerCloseButton} variant="outline" size="sm" inset="unset" flex="auto">Discard</Button>
                </DrawerFooter>
            </DrawerContent>
        </>
    )
}