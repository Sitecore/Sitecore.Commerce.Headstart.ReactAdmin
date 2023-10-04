import OrderList from "@/components/orders/list/OrderList"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

const ProtectedOrdersPage = () => (
  <ProtectedContent hasAccess={[appPermissions.OrderViewer, appPermissions.OrderManager]}>
    <OrderList />
  </ProtectedContent>
)

export default ProtectedOrdersPage
