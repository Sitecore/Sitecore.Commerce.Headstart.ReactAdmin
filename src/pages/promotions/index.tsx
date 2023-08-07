import PromotionList from "@/components/promotions/list/PromotionList"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Promotions List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

const ProtectedPromotionsList = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <PromotionList />
    </ProtectedContent>
  )
}

export default ProtectedPromotionsList
