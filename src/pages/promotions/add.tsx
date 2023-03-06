import {Box} from "@chakra-ui/react"
import {CreateUpdateForm} from "../../lib/components/promotions/CreateUpdateForm"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Create a new promotion",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitcher: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

function ProtectedCreateUpdateForm() {
  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <Box padding="20px">
        <CreateUpdateForm />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedCreateUpdateForm
