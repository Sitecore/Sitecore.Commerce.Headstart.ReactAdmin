import {PromotionForm} from "../../components/promotions/PromotionForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Create a new promotion",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitcher: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

function ProtectedNewPromotionPage() {
  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <PromotionForm />
    </ProtectedContent>
  )
}

export default ProtectedNewPromotionPage
