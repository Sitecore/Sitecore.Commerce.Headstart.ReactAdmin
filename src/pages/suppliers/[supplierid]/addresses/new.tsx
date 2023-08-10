import {SupplierAddressForm} from "@/components/supplieraddresses/SupplierAddressForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"

function ProtectedNewSupplierAddressPage() {
  const router = useRouter()
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <SupplierAddressForm supplierId={router.query.supplierid.toString()} />
    </ProtectedContent>
  )
}

export default ProtectedNewSupplierAddressPage
