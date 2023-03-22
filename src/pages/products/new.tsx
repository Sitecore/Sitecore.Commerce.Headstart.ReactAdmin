import ProtectedContent from "@/components/auth/ProtectedContent"
import ProductDetail from "@/components/products/detail/ProductDetail"
import {appPermissions} from "constants/app-permissions.config"
import {useProductDetail} from "hooks/useProductDetail"

/* This declares the page title and enables breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "New Product",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const ProductDetailPage = () => {
  const {loading, showTabbedView} = useProductDetail()

  if (loading) {
    return <div>Loading...</div>
  }

  return <ProductDetail showTabbedView={showTabbedView} />
}

const ProtectedProductDetailPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <ProductDetailPage />
    </ProtectedContent>
  )
}

export default ProtectedProductDetailPage
