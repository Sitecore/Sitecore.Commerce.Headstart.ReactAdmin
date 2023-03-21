import ProtectedContent from "@/components/auth/ProtectedContent"
import ProductDetail from "@/components/products/detail/ProductDetail"
import {appPermissions} from "constants/app-permissions.config"
import {useProductDetail} from "hooks/useProductDetail"
import {useRouter} from "next/router"
import {useEffect, useState} from "react"

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
  const {isReady, query} = useRouter()
  const {product} = useProductDetail()
  const [loading, setLoading] = useState(true)
  const [showTabbedView, setShowTabbedView] = useState(true)

  const shouldShowTabbedView = (query?: string) => {
    if (query === "true" || query === "false") {
      return query === "true"
    } else if (
      process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_VIEW_TABBED === "false" ||
      process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_VIEW_TABBED === "true"
    ) {
      return process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_VIEW_TABBED === "true"
    } else {
      return true
    }
  }

  useEffect(() => {
    if (isReady) {
      const showTabbedView = shouldShowTabbedView(query?.tabbed?.toString())
      setShowTabbedView(showTabbedView)
      setLoading(false)
    }
  }, [isReady, query])

  if (loading || !product) {
    return <div>Loading...</div>
  }

  return <ProductDetail showTabbedView={showTabbedView} product={product} />
}

const ProtectedProductDetailPage = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <ProductDetailPage />
    </ProtectedContent>
  )
}

export default ProtectedProductDetailPage
