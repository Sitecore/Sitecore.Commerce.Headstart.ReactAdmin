import {CatalogForm} from "components/catalogs"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

const ProtectedNewCatalogPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerCatalogManager}>
      <CatalogForm />
    </ProtectedContent>
  )
}

export default ProtectedNewCatalogPage
