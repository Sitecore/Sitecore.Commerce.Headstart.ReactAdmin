import {CreateUpdateForm} from "components/catalogs"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import {Box} from "@chakra-ui/react"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Create a new catalog",
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
      <CreateUpdateForm />
    </ProtectedContent>
  )
}

export default ProtectedCreateUpdateForm
