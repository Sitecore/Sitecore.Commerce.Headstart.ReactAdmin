import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import SecurityProfileList from "@/components/security-profiles/list/SecurityProfileList"

const ProtectedSecurityProfiles = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.SecurityProfileViewer, appPermissions.SecurityProfileManager]}>
      <SecurityProfileList />
    </ProtectedContent>
  )
}

export default ProtectedSecurityProfiles
