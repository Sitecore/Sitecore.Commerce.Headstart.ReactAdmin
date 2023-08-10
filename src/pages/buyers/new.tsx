import {BuyerForm} from "@/components/buyers/BuyerForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

function ProtectedNewBuyerUserPage() {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <BuyerForm />
    </ProtectedContent>
  )
}

export default ProtectedNewBuyerUserPage
