import {Button, Flex, Hide, Icon, useColorModeValue, VStack} from "@chakra-ui/react"
import React from "react"
import {
  TbBuildingWarehouse,
  TbLayout,
  TbReceipt2,
  TbSettings2,
  TbShoppingCartDiscount,
  TbShoppingCartPlus,
  TbTruckReturn,
  TbUserCheck
} from "react-icons/tb"
import ProtectedContent from "../auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {Link} from "@chakra-ui/next-js"
import schraTheme from "theme/theme"
import {useRouter} from "next/router"
import {useAuth} from "hooks/useAuth"
import {settingsPageItems} from "@/pages/settings"

interface SidebarMenuProps {
  isInDrawer?: boolean
  onLinkClick?: () => void
}
const SidebarMenu = ({isInDrawer, onLinkClick}: SidebarMenuProps) => {
  const router = useRouter()
  const {isSupplier} = useAuth()
  const btnActiveColor = useColorModeValue("inherit", "whiteAlpha.800")
  const btnActiveBgColor = useColorModeValue("white", "whiteAlpha.200")

  const data = [
    {label: "Dashboard", path: "/dashboard", icon: TbLayout, permisshies: appPermissions.DashboardViewer},
    {
      label: "Products",
      path: "/products",
      icon: TbShoppingCartPlus,
      permisshies: [appPermissions.ProductViewer, appPermissions.ProductManager]
    },
    {
      label: "Promotions",
      path: "/promotions",
      icon: TbShoppingCartDiscount,
      permisshies: [appPermissions.PromotionViewer, appPermissions.PromotionManager]
    },
    {
      label: "Orders",
      path: "/orders",
      icon: TbReceipt2,
      permisshies: [appPermissions.OrderViewer, appPermissions.OrderManager]
    },
    {
      label: "Returns",
      path: "/returns",
      icon: TbTruckReturn,
      permisshies: [appPermissions.OrderViewer, appPermissions.OrderManager]
    },
    {
      label: "Buyers",
      path: "/buyers",
      icon: TbUserCheck,
      permisshies: [appPermissions.BuyerViewer, appPermissions.BuyerManager]
    },
    isSupplier
      ? {
          label: "My Supplier",
          path: "/mysupplier",
          icon: TbBuildingWarehouse,
          permisshies: [appPermissions.SupplierViewer, appPermissions.SupplierManager]
        }
      : {
          label: "Suppliers",
          path: "/suppliers",
          icon: TbBuildingWarehouse,
          permisshies: [appPermissions.SupplierViewer, appPermissions.SupplierManager]
        },
    {
      label: "settings",
      path: "/settings",
      icon: TbSettings2,
      permisshies: settingsPageItems.map((item) => item.permisshies).flat()
    }
  ]

  const links = data.map((item) => (
    <ProtectedContent hasAccess={item.permisshies} key={item.label}>
      <Button
        as={Link}
        onClick={onLinkClick}
        href={item.path}
        variant="ghost"
        leftIcon={<Icon as={item.icon} strokeWidth="1.25" fontSize="1.5em" />}
        isActive={"/" + item.label === router?.pathname}
        _active={{
          backgroundColor: btnActiveBgColor,
          color: btnActiveColor,
          boxShadow: "sm",
          borderColor: "chakra-border-color"
        }}
        _hover={{textDecoration: "none", backgroundColor: btnActiveBgColor, boxShadow: "md"}}
        border={".5px solid transparent"}
        textDecoration={"none"}
        style={{marginTop: 0}}
        fontWeight="normal"
        p={3}
        transition={"all .25s cubic-bezier(0.55, 0, 1, 0.45)"}
        h={"unset"}
        w={"100%"}
        justifyContent="flex-start"
        textTransform="capitalize"
      >
        {isInDrawer ? item.label : <Hide below="lg">{item.label}</Hide>}
      </Button>
    </ProtectedContent>
  ))

  const drawerBackground = useColorModeValue("gray.50", "gray.800")

  return (
    <Flex
      w={isInDrawer ? "250px" : ["75px", "75px", "75px", "250px"]}
      background={isInDrawer ? "transparent" : drawerBackground}
      borderRight={isInDrawer ? "none" : ".5px solid"}
      borderColor="chakra-border-color"
      minH={`calc(100vh - ${schraTheme?.sizes?.headerHeight} * 2.5)`} // this prevents uneeded scrollbars: full viewport height - header and footer heights...plus a .5 saftey net
      h="100%"
    >
      <VStack
        alignItems={"flex-start"}
        position="sticky"
        w="100%"
        px={4}
        py={[4, 6, 8]}
        gap={2}
        top="headerHeight"
        maxH={`calc(80vh - ${schraTheme?.sizes?.headerHeight})`}
        h="max-content"
      >
        {links}
      </VStack>
    </Flex>
  )
}

export default SidebarMenu
