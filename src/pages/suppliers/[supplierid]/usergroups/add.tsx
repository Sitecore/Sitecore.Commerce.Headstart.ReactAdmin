import {CreateUpdateForm} from "../../../../components/usergroups"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {supplierUserGroupsService} from "api"

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

const ProtectedCreateUpdateForm = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.SupplierManager}>
      <Box padding="GlobalPadding">
        <CreateUpdateForm ocService={supplierUserGroupsService} />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedCreateUpdateForm
