import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import AdminUserList from "@/components/adminusers/list/AdminUserList"

const ProtectedAdminUsers = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <AdminUserList />
    </ProtectedContent>
  )
}

export default ProtectedAdminUsers
