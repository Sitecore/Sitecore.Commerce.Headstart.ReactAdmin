import {CreateUpdateForm} from "../../../../components/users"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {usersService} from "api"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Create a new user",
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
      <Box padding="GlobalPadding">
        <CreateUpdateForm ocService={usersService} />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedCreateUpdateForm
