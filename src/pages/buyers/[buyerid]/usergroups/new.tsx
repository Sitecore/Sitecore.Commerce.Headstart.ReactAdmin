import {UserGroupFormForm} from "../../../../components/usergroups"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {UserGroups} from "ordercloud-javascript-sdk"

const ProtectedNewUserGroupPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <UserGroupFormForm userGroupService={UserGroups} />
    </ProtectedContent>
  )
}

export default ProtectedNewUserGroupPage
