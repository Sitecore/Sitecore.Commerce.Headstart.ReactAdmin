import {CreateUpdateForm} from "../../../../components/usergroups"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
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

const ProtectedCreateUpdateForm = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <CreateUpdateForm ocService={UserGroups} />
    </ProtectedContent>
  )
}

export default ProtectedCreateUpdateForm
