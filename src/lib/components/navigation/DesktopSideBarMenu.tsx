import {Button, Flex, Icon, IconButton, Image, Link as ChakraLink, Text, useColorModeValue} from "@chakra-ui/react"
import {FiSettings, FiStar} from "react-icons/fi"
import {
  HiChevronDoubleLeft,
  HiOutlineChartBar,
  HiOutlineEmojiSad,
  HiOutlineQrcode,
  HiOutlineUser,
  HiOutlineUserGroup
} from "react-icons/hi"
import React, {useState} from "react"
import {TbBuildingWarehouse, TbShoppingCartDiscount, TbShoppingCartPlus, TbTruckReturn} from "react-icons/tb"
import ProtectedContent from "../auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {Link} from "./Link"

const DesktopSideBarMenu = () => {
  const [navSize, changeNavSize] = useState("large")
  const sidebarBg = useColorModeValue("brand.500", "brand.600")
  const color = useColorModeValue("textColor.900", "textColor.100")

  return (
    <>
      <Flex>
        <Flex
          left="0"
          boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
          borderRadius={navSize == "small" ? "15px" : "30px"}
          w={navSize == "small" ? "75px" : "250px"}
          ml={navSize == "small" ? "0" : "20px"}
          mt={navSize == "small" ? "10px" : "20px"}
          flexDir="column"
          justifyContent="flex-start"
          background={sidebarBg}
          color={color}
        >
          <Flex p="5%" flexDir="column" w="100%" alignItems={navSize == "small" ? "center" : "flex-start"} as="nav">
            <Link
              href="/"
              pl="2"
              pr="2"
              pb="15px"
              pt="15px"
              verticalAlign="middle"
              display="flex"
              color="white"
              _hover={{color: "gray.300"}}
            >
              <>
                <Icon as={HiOutlineChartBar} fontSize={navSize == "small" ? "30px" : "35px"} title="Dashboard"></Icon>
                <Text
                  as="span"
                  pl="GlobalPadding"
                  hidden={navSize == "small" ? true : false}
                  fontSize={navSize == "small" ? "16px" : "21px"}
                  pt="2px"
                >
                  Dashboard
                </Text>
              </>
            </Link>
            <ProtectedContent hasAccess={appPermissions.ProductManager}>
              <Link
                href="/products"
                pl="2"
                pr="2"
                pb="15px"
                verticalAlign="middle"
                display="flex"
                color="white"
                _hover={{color: "gray.300"}}
              >
                <Icon as={HiOutlineQrcode} fontSize={navSize == "small" ? "30px" : "35px"} title="Products"></Icon>
                <Text
                  as="span"
                  pl="GlobalPadding"
                  hidden={navSize == "small" ? true : false}
                  fontSize={navSize == "small" ? "16px" : "21px"}
                  pt="2px"
                >
                  Products
                </Text>
              </Link>
            </ProtectedContent>
            <ProtectedContent hasAccess={appPermissions.ProductManager}>
              <Link
                href="/promotions"
                pl="2"
                pr="2"
                pb="15px"
                verticalAlign="middle"
                display="flex"
                color="white"
                _hover={{color: "gray.300"}}
              >
                <Icon
                  as={TbShoppingCartDiscount}
                  fontSize={navSize == "small" ? "30px" : "35px"}
                  title="Promotions"
                ></Icon>
                <Text
                  as="span"
                  pl="GlobalPadding"
                  hidden={navSize == "small" ? true : false}
                  fontSize={navSize == "small" ? "16px" : "21px"}
                  pt="2px"
                >
                  Promotions
                </Text>
              </Link>
            </ProtectedContent>
            <ProtectedContent hasAccess={appPermissions.OrderManager}>
              <Link
                href="/orders"
                pl="2"
                pr="2"
                pb="15px"
                verticalAlign="middle"
                display="flex"
                color="white"
                _hover={{color: "gray.300"}}
              >
                <Icon as={TbShoppingCartPlus} fontSize={navSize == "small" ? "30px" : "35px"} title="Orders"></Icon>
                <Text
                  as="span"
                  pl="GlobalPadding"
                  hidden={navSize == "small" ? true : false}
                  fontSize={navSize == "small" ? "16px" : "21px"}
                  pt="2px"
                >
                  Orders
                </Text>
              </Link>
            </ProtectedContent>
            <ProtectedContent hasAccess={appPermissions.OrderManager}>
              <Link
                href="/returns"
                pl="2"
                pr="2"
                pb="15px"
                verticalAlign="middle"
                display="flex"
                color="white"
                _hover={{color: "gray.300"}}
              >
                <Icon as={TbTruckReturn} fontSize={navSize == "small" ? "30px" : "35px"} title="Returns"></Icon>
                <Text
                  as="span"
                  pl="GlobalPadding"
                  hidden={navSize == "small" ? true : false}
                  fontSize={navSize == "small" ? "16px" : "21px"}
                  pt="2px"
                >
                  Returns
                </Text>
              </Link>
            </ProtectedContent>
            <ProtectedContent hasAccess={appPermissions.BuyerManager}>
              <Link
                href="/buyers"
                pl="2"
                pr="2"
                pb="15px"
                verticalAlign="middle"
                display="flex"
                color="white"
                _hover={{color: "gray.300"}}
              >
                <Icon as={HiOutlineUserGroup} fontSize={navSize == "small" ? "30px" : "35px"}></Icon>
                <Text
                  as="span"
                  pl="GlobalPadding"
                  hidden={navSize == "small" ? true : false}
                  title="Buyers"
                  fontSize={navSize == "small" ? "16px" : "21px"}
                  pt="2px"
                >
                  Buyers
                </Text>
              </Link>
            </ProtectedContent>
            <ProtectedContent hasAccess={appPermissions.SupplierManager}>
              <Link
                href="/suppliers"
                pl="2"
                pr="2"
                pb="15px"
                verticalAlign="middle"
                display="flex"
                color="white"
                _hover={{color: "gray.300"}}
              >
                <Icon as={TbBuildingWarehouse} fontSize={navSize == "small" ? "30px" : "35px"}></Icon>
                <Text
                  as="span"
                  pl="GlobalPadding"
                  hidden={navSize == "small" ? true : false}
                  title="Suppliers"
                  fontSize={navSize == "small" ? "16px" : "21px"}
                  pt="2px"
                >
                  Suppliers
                </Text>
              </Link>
            </ProtectedContent>
            <ProtectedContent hasAccess={appPermissions.SettingsManager}>
              <Link
                href="/settings"
                pl="2"
                pr="2"
                pb="15px"
                verticalAlign="middle"
                display="flex"
                color="white"
                _hover={{color: "gray.300"}}
              >
                <Icon as={FiSettings} fontSize={navSize == "small" ? "30px" : "35px"} title="Settings"></Icon>
                <Text
                  as="span"
                  pl="GlobalPadding"
                  hidden={navSize == "small" ? true : false}
                  fontSize={navSize == "small" ? "16px" : "21px"}
                  pt="2px"
                >
                  Settings
                </Text>
              </Link>
            </ProtectedContent>
          </Flex>
        </Flex>{" "}
      </Flex>
    </>
  )
}

export default DesktopSideBarMenu
