import {CloseIcon, HamburgerIcon} from "@chakra-ui/icons"
import {
  useDisclosure,
  Button,
  Icon,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useColorModeValue
} from "@chakra-ui/react"
import DesktopSideBarMenu from "./DesktopSideBarMenu"

interface NavMenuDrawerProps {}
export function NavMenuDrawer({}: NavMenuDrawerProps) {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const drawerBackground = useColorModeValue("gray.50", "gray.800")

  return (
    <>
      <Button onClick={onOpen}>
        <Icon as={isOpen ? CloseIcon : HamburgerIcon} />
      </Button>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent backgroundColor={drawerBackground}>
          <DrawerCloseButton />
          <DrawerBody>
            <DesktopSideBarMenu isInDrawer onLinkClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
