import ProductList from "@/components/products/list/ProductList"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

const ProtectedProducts = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.ProductViewer, appPermissions.ProductManager]}>
      <ProductList />
    </ProtectedContent>
  )
}

export default ProtectedProducts
