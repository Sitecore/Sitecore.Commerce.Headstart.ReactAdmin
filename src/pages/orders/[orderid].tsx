import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {OrderDetail} from "@/components/orders/detail/OrderDetail"
import {useOrderDetail} from "hooks/useOrderDetail"
import {OrderDetailSkeleton} from "@/components/orders/detail/OrderDetailSkeleton"

const OrderDetailPage = () => {
  const orderDetailProps = useOrderDetail()
  if (orderDetailProps.loading) {
    return <OrderDetailSkeleton />
  }
  return <OrderDetail {...orderDetailProps} />
}

const ProtectedOrderDetailpage = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.OrderViewer, appPermissions.OrderManager]}>
      <OrderDetailPage />
    </ProtectedContent>
  )
}

export default ProtectedOrderDetailpage
