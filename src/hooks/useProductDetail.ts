import {useRouter} from "next/router"
import {Products} from "ordercloud-javascript-sdk"
import {useState, useEffect} from "react"
import {IProduct} from "types/ordercloud/IProduct"

export function useProductDetail() {
  const {isReady, query, push} = useRouter()
  const [product, setProduct] = useState(null as IProduct)
  const [showTabbedView, setShowTabbedView] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProduct = async () => {
      const _product = await Products.Get<IProduct>(query.productid.toString())
      setProduct(_product)
    }

    if (query.productid) {
      getProduct()
    }
  }, [query.productid])

  useEffect(() => {
    const shouldShowTabbedView = () => {
      const queryStringTabbed = query?.tabbed?.toString()
      if (queryStringTabbed === "true" || queryStringTabbed === "false") {
        return queryStringTabbed === "true"
      } else if (
        process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_VIEW_TABBED === "false" ||
        process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_VIEW_TABBED === "true"
      ) {
        return process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_VIEW_TABBED === "true"
      } else {
        return true
      }
    }

    const setCurrentTabQueryParam = () => {
      if (!query["tab"]) {
        push({query: {...query, tab: "details"}}, undefined, {shallow: true})
      }
    }
    if (isReady) {
      const showTabbedView = shouldShowTabbedView()
      setCurrentTabQueryParam()
      setShowTabbedView(showTabbedView)
      setLoading(false)
    }
  }, [isReady, query, push])

  return {product, loading, showTabbedView}
}
