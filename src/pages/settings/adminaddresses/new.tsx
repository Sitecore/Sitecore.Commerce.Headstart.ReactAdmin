import {AdminAddressForm} from "@/components/adminaddresses/AdminAddressForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Create a new admin address",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

function ProtectedNewAdminAddressPage() {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <AdminAddressForm />
    </ProtectedContent>
  )
}

export default ProtectedNewAdminAddressPage
