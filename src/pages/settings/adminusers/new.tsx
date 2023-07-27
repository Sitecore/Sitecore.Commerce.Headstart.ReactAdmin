import {AdminUserForm} from "@/components/adminusers/AdminUserForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Create a new admin user",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

function ProtectedNewAdminUserPage() {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <AdminUserForm />
    </ProtectedContent>
  )
}

export default ProtectedNewAdminUserPage
