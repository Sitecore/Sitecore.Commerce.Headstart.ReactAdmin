import {UserGroupFormForm} from "../../../../components/usergroups"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import {SupplierUserGroups} from "ordercloud-javascript-sdk"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Create a new user group",
        metas: {
          hasBreadcrumbs: true,
          hasSupplierContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const ProtectedSupplierUserGroupPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <UserGroupFormForm userGroupService={SupplierUserGroups} />
    </ProtectedContent>
  )
}

export default ProtectedSupplierUserGroupPage
