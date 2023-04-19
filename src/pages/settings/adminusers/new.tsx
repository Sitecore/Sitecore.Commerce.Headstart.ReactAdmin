import {Box} from "@chakra-ui/react"
import {CreateUpdateForm} from "components/adminusers/CreateUpdateForm"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Create a new admin user",
        metas: {
          hasBreadcrumbs: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

function ProtectedCreateUpdateForm() {
  return (
    <ProtectedContent hasAccess={appPermissions.SettingsManager}>
      <CreateUpdateForm />
    </ProtectedContent>
  )
}

export default ProtectedCreateUpdateForm
