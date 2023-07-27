import OrderList from "@/components/orders/list/OrderList"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Orders List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const ProtectedOrdersPage = () => (
  <ProtectedContent hasAccess={appPermissions.OrderManager}>
    <OrderList />
  </ProtectedContent>
)

export default ProtectedOrdersPage
