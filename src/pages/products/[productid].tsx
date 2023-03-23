import ProtectedContent from "@/components/auth/ProtectedContent"
import ProductDetail from "@/components/products/detail/ProductDetail"
import {appPermissions} from "constants/app-permissions.config"
import {useProductDetail} from "hooks/useProductDetail"

/* This declares the page title and enables breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Product Detail",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const ProductDetailPage = () => {
  const {product, defaultPriceSchedule, loading, showTabbedView, initialTab} = useProductDetail()

  if (loading || !product) {
    return <div>Loading...</div>
  }

  return (
    <ProductDetail
      showTabbedView={showTabbedView}
      initialTab={initialTab}
      product={product}
      defaultPriceSchedule={defaultPriceSchedule}
    />
  )
}

const ProtectedProductDetailPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <ProductDetailPage />
    </ProtectedContent>
  )
}

export default ProtectedProductDetailPage
