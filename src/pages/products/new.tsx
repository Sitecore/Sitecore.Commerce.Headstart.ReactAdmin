import ProtectedContent from "@/components/auth/ProtectedContent"
import ProductDetail from "@/components/products/detail/ProductDetail"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "next/router"
import {useEffect, useState} from "react"

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
  const {isReady, query} = useRouter()
  const [loading, setLoading] = useState(true)
  const [showTabbedView, setShowTabbedView] = useState(true)

  useEffect(() => {
    if (isReady) {
      setShowTabbedView(query?.tabbed?.toString() !== "false")
      setLoading(false)
    }
  }, [isReady, query])

  if (loading) {
    return
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
