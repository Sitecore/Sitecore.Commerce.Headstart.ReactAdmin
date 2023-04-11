import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Select,
  Show,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react"
import { BsMoonStarsFill, BsSun } from "react-icons/bs"
import { TbDoorExit, TbInbox, TbMoon, TbPalette, TbSun, TbUserCircle } from "react-icons/tb";
import React, { useState } from "react"
import { ChevronDownIcon } from "@chakra-ui/icons"
import Cookies from "universal-cookie"
import { ItemContent } from "../generic/ItemContent"
import ProtectedContent from "../auth/ProtectedContent"
import { appPermissions } from "constants/app-permissions.config"
import { useAuth } from "hooks/useAuth"
import { Link } from "./Link"

const MobileNavigation = () => {
  const { Logout } = useAuth()
  let usersToken = typeof window !== "undefined" ? localStorage.getItem("usersToken") : ""
  let menuBg = useColorModeValue("white", "navy.800")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const { colorMode, toggleColorMode } = useColorMode()
  const color = useColorModeValue("textColor.900", "textColor.100")
  const [selectedOption, setSelectedOption] = useState<String>()
  // This function is triggered when the select changes
  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setSelectedOption(value)
    const cookies = new Cookies()
    cookies.set("currenttheme", value, {
      path: "/"
    })
    //Reload page so the theme takes affect
    window.location.reload()
  }
  const cookies = new Cookies()
  let currenttheme
  let currentthemename
  if (cookies.get("currenttheme") !== null) {
    currenttheme = cookies.get("currenttheme")
  }
  return (
    <HStack alignItems="center">
      <Menu>
        <MenuButton>
          <Icon as={TbInbox} strokeWidth="1.5" fontSize="2xl" />
        </MenuButton>
        <MenuList borderRadius="lg" p={3} display="flex" flexDirection="column" gap={1}>
          <MenuItem borderRadius="lg">
            <ItemContent
              time="13 minutes ago"
              info="by AliciaAdmin01"
              boldInfo="New User Created"
              aName="Alicia"
              aSrc="/images/avatars/avatar1.png"
            />
          </MenuItem>
          <MenuItem borderRadius="lg">
            <ItemContent
              time="2 days ago"
              info="PSPOTG10CSWSB"
              boldInfo="Product Deleted"
              aName="Josh Henry"
              aSrc="/images/avatars/avatar2.png"
            />
          </MenuItem>
          <MenuItem borderRadius="lg">
            <ItemContent
              time="3 days ago"
              info="Payment succesfully completed!"
              boldInfo=""
              aName="Kara"
              aSrc="/images/avatars/avatar3.png"
            />
          </MenuItem>
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton>
          <HStack>
            <Avatar
              name={usersToken}
              src={`https://source.unsplash.com/random/?landscape`}
              borderRadius="50%"
              mr="0"
              ml="15px"
              size="md"
              border=".5px solid #ccc"
            />
            <Show above="md">
              <Text>
                {usersToken}
              </Text>
              <ChevronDownIcon />
            </Show>
          </HStack>
        </MenuButton>
        <MenuList>
          <ProtectedContent hasAccess={appPermissions.MeManager}>
            <MenuItem icon={<Icon as={TbUserCircle} strokeWidth="1.25" fontSize="1.5em" />} lineHeight="0">
              Manage Profile
            </MenuItem>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.MeManager}>
            <MenuItem icon={<Icon as={TbInbox} strokeWidth="1.25" fontSize="1.5em" />} lineHeight="0">
              Notifications
            </MenuItem>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.MeManager}>
            <MenuItem onClick={toggleColorMode} icon={<Icon as={colorMode === "dark" ? TbSun : TbMoon} strokeWidth="1.25" fontSize="1.5em" />} lineHeight="0">
              Color Mode
            </MenuItem>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.MeManager}>
            <MenuItem ref={btnRef} onClick={onOpen} _hover={{ textDecoration: "none" }} lineHeight="0"
              icon={<Icon as={TbPalette} strokeWidth="1.25" fontSize="1.5em" />}>
              Theming
            </MenuItem>
          </ProtectedContent>
          <MenuDivider />
          <MenuItem color="danger.500" onClick={() => Logout()} lineHeight="0" icon={<Icon as={TbDoorExit} display="inline-flex" lineHeight="0" strokeWidth="1.25" fontSize="1.5em" />}>
            Log Out
          </MenuItem>
        </MenuList>
      </Menu>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color={color}>Application Settings</DrawerHeader>

          <DrawerBody color={color}>
            <Tooltip label={colorMode === "dark" ? "Set Light Model" : "Set Dark Model"}>
              <Button
                aria-label="Toggle Color Mode"
                onClick={toggleColorMode}
                _focus={{ boxShadow: "none" }}
                size={"md"}
                w="fit-content"
              >
                {colorMode === "light" ? <BsMoonStarsFill /> : <BsSun />}
              </Button>
            </Tooltip>
            <Text mt="10">Change Theme:</Text>
            <Select id="ThemeDropdown" onChange={selectChange} placeholder="Select a theme" value={currenttheme}>
              <option value="styles/theme/sitecorecommerce/">Sitecore Commerce</option>
              <option value="styles/theme/playsummit/">Play Summit</option>
              <option value="styles/theme/industrial/">Industrial</option>
            </Select>

            <Flex justify="center" direction="column" align="center" w="100%" width="full" pb="10px" pt="90px">
              <Image src="/images/SidebarHelpImage.png" w="90px" alt="" />
              <Flex direction="column" align="center" textAlign="center" mb="12px" me="12px" w="100%" width="full">
                <Text fontSize="14px" fontWeight="bold">
                  Need help?
                </Text>
                <Text fontSize="10px">Please check our docs.</Text>
              </Flex>
              <Link href="/docs">
                <Button colorScheme="secondary" size="sm" fontWeight="bold" minW="185px" m="0" fontSize="10px">
                  Documentation
                </Button>
              </Link>
            </Flex>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </HStack>
  )
}

export default MobileNavigation
