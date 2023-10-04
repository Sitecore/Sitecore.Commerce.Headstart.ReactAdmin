import {CategoryForm} from "components/categories"
import {Box} from "@chakra-ui/react"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

const ProtectedNewCategoryPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerCatalogManager}>
      <Box pl="GlobalPadding">
        <CategoryForm />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedNewCategoryPage
