import {UserForm} from "../../../../components/users"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {Users} from "ordercloud-javascript-sdk"

const ProtectedNewBuyerUserPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <UserForm userService={Users} />
    </ProtectedContent>
  )
}

export default ProtectedNewBuyerUserPage
