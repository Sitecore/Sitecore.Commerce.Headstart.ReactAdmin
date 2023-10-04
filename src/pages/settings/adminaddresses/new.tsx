import {AddressForm} from "@/components/addresses"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

function ProtectedNewAdminAddressPage() {
  return (
    <ProtectedContent hasAccess={appPermissions.AdminAddressManager}>
      <AddressForm addressType="admin" />
    </ProtectedContent>
  )
}

export default ProtectedNewAdminAddressPage
