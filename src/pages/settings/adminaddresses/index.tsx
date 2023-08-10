import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import AdminAddressList from "@/components/adminaddresses/list/AdminAddressList"

const ProtectedAdminAddresses = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <AdminAddressList />
    </ProtectedContent>
  )
}

export default ProtectedAdminAddresses
