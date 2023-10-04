import ProtectedContent from "@/components/auth/ProtectedContent"
import ProductDetail from "@/components/products/detail/ProductDetail"
import {ProductDetailSkeleton} from "@/components/products/detail/ProductDetailSkeleton"
import {appPermissions} from "config/app-permissions.config"
import {useProductDetail} from "hooks/useProductDetail"

const ProductDetailPage = () => {
  const {
    product,
    inventoryRecords,
    defaultPriceSchedule,
    overridePriceSchedules,
    specs,
    variants,
    facets,
    loading,
    initialTab,
    catalogAssignments,
    categoryAssignments
  } = useProductDetail()

  if (loading) {
    return <ProductDetailSkeleton />
  }

  return (
    <ProductDetail
      defaultOwnerId=""
      initialTab={initialTab}
      initialProduct={product}
      initialInventoryRecords={inventoryRecords}
      initialDefaultPriceSchedule={defaultPriceSchedule}
      initialOverridePriceSchedules={overridePriceSchedules}
      initialSpecs={specs}
      initialVariants={variants}
      facets={facets}
      initialCatalogAssignments={catalogAssignments}
      initialCategoryAssignments={categoryAssignments}
    />
  )
}

const ProtectedProductDetailPage = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.ProductViewer, appPermissions.ProductManager]}>
      <ProductDetailPage />
    </ProtectedContent>
  )
}

export default ProtectedProductDetailPage
