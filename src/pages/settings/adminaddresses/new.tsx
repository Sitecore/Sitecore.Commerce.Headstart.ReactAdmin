import {AdminAddressForm} from "@/components/adminaddresses/AdminAddressForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

function ProtectedNewAdminAddressPage() {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <AdminAddressForm />
    </ProtectedContent>
  )
}

export default ProtectedNewAdminAddressPage
