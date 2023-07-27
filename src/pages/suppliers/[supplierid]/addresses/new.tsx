import {SupplierAddressForm} from "@/components/supplieraddresses/SupplierAddressForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"

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
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <SupplierAddressForm />
    </ProtectedContent>
  )
}

export default ProtectedNewSupplierAddressPage
