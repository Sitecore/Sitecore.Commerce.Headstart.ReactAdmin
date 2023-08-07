import {UserGroupFormForm} from "../../../../components/usergroups"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {UserGroups} from "ordercloud-javascript-sdk"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Create a new user group",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const ProtectedNewUserGroupPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <UserGroupFormForm userGroupService={UserGroups} />
    </ProtectedContent>
  )
}

export default ProtectedNewUserGroupPage
