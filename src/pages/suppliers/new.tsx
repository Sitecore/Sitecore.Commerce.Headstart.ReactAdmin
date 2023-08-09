import {SupplierForm} from "../../components/suppliers/SupplierForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

function ProtectedNewSupplierPage() {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <SupplierForm />
    </ProtectedContent>
  )
}

export default ProtectedNewSupplierPage
