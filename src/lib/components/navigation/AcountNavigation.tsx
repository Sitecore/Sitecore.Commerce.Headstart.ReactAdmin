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
import {BsMoonStarsFill, BsSun} from "react-icons/bs"
import {HiOutlineBell, HiOutlineCog} from "react-icons/hi"
import React, {useState} from "react"
import {ChevronDownIcon} from "@chakra-ui/icons"
import Cookies from "universal-cookie"
import {ItemContent} from "../generic/ItemContent"
import ProtectedContent from "../auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {useAuth} from "lib/hooks/useAuth"
import {Link} from "./Link"

const MobileNavigation = () => {
  const {Logout} = useAuth()
  let usersToken = typeof window !== "undefined" ? localStorage.getItem("usersToken") : ""
  let menuBg = useColorModeValue("white", "navy.800")
  const {isOpen, onOpen, onClose} = useDisclosure()
  const btnRef = React.useRef()
  const {colorMode, toggleColorMode} = useColorMode()
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
    <HStack>
      <Menu>
        <MenuButton>
          <Icon as={HiOutlineBell} fontSize="24px" />
        </MenuButton>
        <MenuList p="16px 8px" bg={menuBg}>
          <Flex flexDirection="column">
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="13 minutes ago"
                info="from Alicia"
                boldInfo="New Message"
                aName="Alicia"
                aSrc="/images/avatars/avatar1.png"
              />
            </MenuItem>
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="2 days ago"
                info="by Josh Henry"
                boldInfo="New Album"
                aName="Josh Henry"
                aSrc="/images/avatars/avatar2.png"
              />
            </MenuItem>
            <MenuItem borderRadius="8px">
              <ItemContent
                time="3 days ago"
                info="Payment succesfully completed!"
                boldInfo=""
                aName="Kara"
                aSrc="/images/avatars/avatar3.png"
              />
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton>
          <HStack>
            <Avatar
              name={usersToken}
              src={`https://robohash.org/{usersToken}.png`}
              borderRadius="50%"
              mr="0"
              ml="15px"
              size="md"
              border=".5px solid #ccc"
            />
            <Show breakpoint="(min-width: 900px)">
              <Text fontSize="18px" color="gray.500">
                {usersToken}
              </Text>
              <ChevronDownIcon ml="10px" />
            </Show>
          </HStack>
        </MenuButton>
        <MenuList>
          <ProtectedContent hasAccess={appPermissions.MeManager}>
            <MenuItem>
              <Link href="#" pl="2" pr="2">
                Manage Profile
              </Link>
            </MenuItem>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.MeManager}>
            <MenuItem>
              <Link href="#" pl="2" pr="2">
                Notifications
              </Link>
            </MenuItem>
          </ProtectedContent>
          <MenuItem onClick={() => Logout()}>
            <Text pl="2" pr="2">
              Log Out
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
      <Button ref={btnRef} onClick={onOpen} variant="unstyled">
        <Icon as={HiOutlineCog} fontSize="24px" />
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color={color}>Application Settings</DrawerHeader>

          <DrawerBody color={color}>
            <Tooltip label={colorMode === "dark" ? "Set Light Model" : "Set Dark Model"}>
              <Button
                colorScheme="brandButtons"
                aria-label="Toggle Color Mode"
                onClick={toggleColorMode}
                _focus={{boxShadow: "none"}}
                size={"md"}
                w="fit-content"
              >
                {colorMode === "light" ? <BsMoonStarsFill /> : <BsSun />}
              </Button>
            </Tooltip>
            <Text mt="10">Change Theme:</Text>
            <Select id="ThemeDropdown" onChange={selectChange} placeholder="Select a theme" value={currenttheme}>
              <option value="lib/styles/theme/sitecorecommerce/">Sitecore Commerce</option>
              <option value="lib/styles/theme/playsummit/">Play Summit</option>
              <option value="lib/styles/theme/industrial/">Industrial</option>
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
                <Button variant="tertiaryButton" size="sm" fontWeight="bold" minW="185px" m="0" fontSize="10px">
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
