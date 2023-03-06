import {HStack} from "@chakra-ui/react"
import {useAuth} from "lib/hooks/useAuth"
import ProtectedContent from "../auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {Link} from "./Link"

const MainNavigation = () => {
  const {Logout} = useAuth()
  return (
    <HStack width="full" align="center">
      <ProtectedContent hasAccess={appPermissions.ProductManager}>
        <Link href="/products" pl="2" pr="2">
          Products
        </Link>
      </ProtectedContent>
      <ProtectedContent hasAccess={appPermissions.OrderManager}>
        <Link href="/orders" pl="2" pr="2">
          Orders
        </Link>
      </ProtectedContent>
      <ProtectedContent hasAccess={appPermissions.BuyerManager}>
        <Link href="/buyers" pl="2" pr="2">
          Users
        </Link>
      </ProtectedContent>
      <Link href="" pl="2" pr="2" onClick={() => Logout()}>
        Log out
      </Link>
    </HStack>
  )
}

export default MainNavigation
