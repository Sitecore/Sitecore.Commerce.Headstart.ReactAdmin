import ProtectedContent from "@/components/auth/ProtectedContent"
import ProductDetail from "@/components/products/detail/ProductDetail"
import {ProductDetailSkeleton} from "@/components/products/detail/ProductDetailSkeleton"
import {appPermissions} from "config/app-permissions.config"
import {useProductDetail} from "hooks/useProductDetail"

const ProductDetailPage = () => {
  const {loading, initialTab, facets, defaultOwnerId} = useProductDetail()

  if (loading) {
    return <ProductDetailSkeleton />
  }

  return (
    <ProductDetail
      initialInventoryRecords={[]}
      defaultOwnerId={defaultOwnerId}
      initialTab={initialTab}
      facets={facets}
      initialSpecs={[]}
      initialVariants={[]}
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
