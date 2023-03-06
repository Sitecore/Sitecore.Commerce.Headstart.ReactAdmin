import {Flex, Icon} from "@chakra-ui/react"
import {FiSettings} from "react-icons/fi"
import {HiOutlineChartBar, HiOutlineQrcode, HiOutlineUserGroup} from "react-icons/hi"
import {TbBuildingWarehouse, TbShoppingCartDiscount, TbShoppingCartPlus, TbTruckReturn} from "react-icons/tb"
import ProtectedContent from "../auth/ProtectedContent"
import React from "react"
import {appPermissions} from "lib/constants/app-permissions.config"
import {Link} from "./Link"

const MobileSideBarMenu = () => {
  return (
    <>
      <Flex
        //pos="sticky"
        left="0"
        h="95vh"
        marginTop="5px"
        boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
        borderRadius="15px"
        w="75px"
        ml="0"
        flexDir="column"
        justifyContent="flex-start"
        background="brand.500"
        color="white"
      >
        <Flex p="5%" flexDir="column" w="100%" alignItems="center" as="nav">
          <Link href="/" pl="2" pr="2" pb="15px" pt="30px">
            <Icon as={HiOutlineChartBar} fontSize="30px" title="Dashboard" color="white"></Icon>
          </Link>
          <ProtectedContent hasAccess={appPermissions.ProductManager}>
            <Link href="/products" pl="2" pr="2" pb="15px">
              <Icon as={HiOutlineQrcode} fontSize="30px" title="Products" color="white"></Icon>
            </Link>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.ProductManager}>
            <Link href="/promotions" pl="2" pr="2" pb="15px">
              <Icon as={TbShoppingCartDiscount} fontSize="30px" title="Promotions"></Icon>
            </Link>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.OrderManager}>
            <Link href="/orders" pl="2" pr="2" pb="15px">
              <Icon as={TbShoppingCartPlus} fontSize="30px" title="Orders"></Icon>
            </Link>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.OrderManager}>
            <Link href="/returns" pl="2" pr="2" pb="15px">
              <Icon as={TbTruckReturn} fontSize="30px" title="Returns" color="white"></Icon>
            </Link>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.BuyerManager}>
            <Link href="/buyers" pl="2" pr="2" pb="15px">
              <Icon as={HiOutlineUserGroup} fontSize="30px"></Icon>
            </Link>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.SupplierManager}>
            <Link href="/suppliers" pl="2" pr="2" pb="15px">
              <Icon as={TbBuildingWarehouse} fontSize="30px"></Icon>
            </Link>
          </ProtectedContent>
          <ProtectedContent hasAccess={appPermissions.MeManager}>
            <Link href="/settings" pl="2" pr="2" pb="15px">
              <Icon as={FiSettings} fontSize="30px" title="Settings" color="white"></Icon>
            </Link>
          </ProtectedContent>
        </Flex>
      </Flex>
    </>
  )
}

export default MobileSideBarMenu
