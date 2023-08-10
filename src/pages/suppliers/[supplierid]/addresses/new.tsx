import {SupplierAddressForm} from "@/components/supplieraddresses/SupplierAddressForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {useRouter} from "hooks/useRouter"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Create a new supplier address",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

function ProtectedNewSupplierAddressPage() {
  const router = useRouter()
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <SupplierAddressForm supplierId={router.query.supplierid.toString()} />
    </ProtectedContent>
  )
}

export default ProtectedNewSupplierAddressPage
