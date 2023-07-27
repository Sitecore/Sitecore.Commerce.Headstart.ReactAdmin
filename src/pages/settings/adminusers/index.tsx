import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import AdminUserList from "@/components/adminusers/list/AdminUserList"

/* This declares the page title and enables the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Admin Users List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const ProtectedAdminUsers = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <AdminUserList />
    </ProtectedContent>
  )
}

export default ProtectedAdminUsers
