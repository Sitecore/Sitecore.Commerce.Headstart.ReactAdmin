import {UserForm} from "../../../../components/users"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {SupplierUsers} from "ordercloud-javascript-sdk"

const ProtectedNewSupplierUser = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <UserForm userService={SupplierUsers} />
    </ProtectedContent>
  )
}

export default ProtectedNewSupplierUser
