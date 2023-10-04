import {SecurityProfileDetail} from "@/components/security-profiles/detail/SecurityProfileDetail"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

function ProtectedNewSecurityProfileDetailPage() {
  return (
    <ProtectedContent hasAccess={appPermissions.SecurityProfileManager}>
      <SecurityProfileDetail />
    </ProtectedContent>
  )
}

export default ProtectedNewSecurityProfileDetailPage
