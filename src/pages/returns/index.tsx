import OrderReturnList from "@/components/returns/list/OrderReturnList"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

const ProtectedReturnsPage = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.OrderViewer, appPermissions.OrderManager]}>
      <OrderReturnList />
    </ProtectedContent>
  )
}

export default ProtectedReturnsPage
