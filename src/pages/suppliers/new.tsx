import {SupplierForm} from "../../components/suppliers/SupplierForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Create a new supplier",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

function ProtectedNewSupplierPage() {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <SupplierForm />
    </ProtectedContent>
  )
}

export default ProtectedNewSupplierPage
