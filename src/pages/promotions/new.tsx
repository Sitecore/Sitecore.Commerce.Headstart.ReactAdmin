import {PromotionForm} from "../../components/promotions/PromotionForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

function ProtectedNewPromotionPage() {
  return (
    <ProtectedContent hasAccess={appPermissions.PromotionManager}>
      <PromotionForm />
    </ProtectedContent>
  )
}

export default ProtectedNewPromotionPage
