import {SupplierAddressForm} from "@/components/supplieraddresses/SupplierAddressForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

function ProtectedNewSupplierAddressPage() {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <SupplierAddressForm />
    </ProtectedContent>
  )
}

export default ProtectedNewSupplierAddressPage
