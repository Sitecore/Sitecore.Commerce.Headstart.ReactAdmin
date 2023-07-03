import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {OrderDetail} from "@/components/orders/detail/OrderDetail"
import {useOrderDetail} from "hooks/useOrderDetail"
import {OrderDetailSkeleton} from "@/components/orders/detail/OrderDetailSkeleton"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Order Details",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}
const OrderDetailPage = () => {
  const {loading, ...orderDetailProps} = useOrderDetail()
  if (loading) {
    return <OrderDetailSkeleton />
  }
  return <OrderDetail {...orderDetailProps} />
}

const ProtectedOrderDetailpage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <OrderDetailPage />
    </ProtectedContent>
  )
}

export default ProtectedOrderDetailpage
