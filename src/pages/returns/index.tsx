import OrderReturnList from "@/components/returns/list/OrderReturnList"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Returns List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const ProtectedReturnsPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <OrderReturnList />
    </ProtectedContent>
  )
}

export default ProtectedReturnsPage
