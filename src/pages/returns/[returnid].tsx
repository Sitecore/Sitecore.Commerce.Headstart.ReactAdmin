import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useOrderReturnDetail} from "hooks/useOrderReturnDetail"
import {OrderReturnDetail} from "@/components/returns/detail/OrderReturnDetail"
import {OrderReturnDetailSkeleton} from "@/components/returns/detail/OrderReturnDetailSkeleton"

const OrderReturnDetailPage = () => {
  const orderReturnDetailProps = useOrderReturnDetail()
  if (orderReturnDetailProps.loading) {
    return <OrderReturnDetailSkeleton />
  }
  return <OrderReturnDetail {...orderReturnDetailProps} />
}

const ProtectedOrderDetailpage = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.OrderViewer, appPermissions.OrderManager]}>
      <OrderReturnDetailPage />
    </ProtectedContent>
  )
}

export default ProtectedOrderDetailpage
