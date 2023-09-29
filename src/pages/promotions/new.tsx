import {PromotionDetails} from "@/components/promotions/details/PromotionDetails"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

function ProtectedNewPromotionPage() {
  return (
    <ProtectedContent hasAccess={appPermissions.PromotionManager}>
      <PromotionDetails />
    </ProtectedContent>
  )
}

export default ProtectedNewPromotionPage
