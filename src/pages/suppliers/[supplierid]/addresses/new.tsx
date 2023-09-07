import {AddressForm} from "@/components/addresses"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"

function ProtectedNewSupplierAddressPage() {
  const router = useRouter()
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierAddressManager}>
      <AddressForm addressType="supplier" parentId={router.query.supplierid.toString()} />
    </ProtectedContent>
  )
}

export default ProtectedNewSupplierAddressPage
