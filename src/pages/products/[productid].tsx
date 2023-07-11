import ProtectedContent from "@/components/auth/ProtectedContent"
import ProductDetail from "@/components/products/detail/ProductDetail"
import {ProductDetailSkeleton} from "@/components/products/detail/ProductDetailSkeleton"
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
  const {
    product,
    defaultPriceSchedule,
    overridePriceSchedules,
    specs,
    variants,
    facets,
    loading,
    showTabbedView,
    initialTab,
    catalogAssignments,
    categoryAssignments
  } = useProductDetail()

  if (loading) {
    return <ProductDetailSkeleton />
  }

  return (
    <ProductDetail
      showTabbedView={showTabbedView}
      initialTab={initialTab}
      initialProduct={product}
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
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <ProductDetailPage />
    </ProtectedContent>
  )
}

export default ProtectedProductDetailPage
