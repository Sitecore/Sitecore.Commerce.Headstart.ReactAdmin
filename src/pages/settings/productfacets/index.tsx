import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "constants/app-permissions.config"
import ProductFacetList from "@/components/productfacets/list/ProductFacetList"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Product Facets List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const ProtectedProductFacets = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <ProductFacetList />
    </ProtectedContent>
  )
}

export default ProtectedProductFacets
