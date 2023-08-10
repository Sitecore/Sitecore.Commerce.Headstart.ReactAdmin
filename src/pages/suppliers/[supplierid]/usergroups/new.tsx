import {UserGroupFormForm} from "../../../../components/usergroups"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {SupplierUserGroups} from "ordercloud-javascript-sdk"

const ProtectedSupplierUserGroupPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <UserGroupFormForm userGroupService={SupplierUserGroups} />
    </ProtectedContent>
  )
}

export default ProtectedSupplierUserGroupPage
