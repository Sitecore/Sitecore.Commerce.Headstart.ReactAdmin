import ProductList from "@/components/products/list/ProductList"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Products List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const ProtectedProducts = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <ProductList />
    </ProtectedContent>
  )
}

export default ProtectedProducts
