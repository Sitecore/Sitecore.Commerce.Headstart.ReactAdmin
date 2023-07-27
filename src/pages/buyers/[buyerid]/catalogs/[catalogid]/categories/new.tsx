import {CategoryForm} from "components/categories"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Create a new category",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

const ProtectedNewCategoryPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Box pl="GlobalPadding">
        <CategoryForm />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedNewCategoryPage
