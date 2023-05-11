import {ProductDetailTab} from "@/components/products/detail/ProductDetail"
import {useRouter} from "next/router"
import {PriceSchedules, Products} from "ordercloud-javascript-sdk"
import {useState, useEffect} from "react"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {IProduct} from "types/ordercloud/IProduct"

export function useProductDetail() {
  const {isReady, query, push} = useRouter()
  const [product, setProduct] = useState(null as IProduct)
  const [defaultPriceSchedule, setDefaultPriceSchedule] = useState(null as IPriceSchedule)
  const [showTabbedView, setShowTabbedView] = useState(true)
  const [loading, setLoading] = useState(true)
  const [initialTab, setInitialTab] = useState("Details" as ProductDetailTab)

  useEffect(() => {
    const getProduct = async () => {
      const _product = await Products.Get<IProduct>(query.productid.toString())
      if (_product?.DefaultPriceScheduleID) {
        const _defaultPriceSchedule = await PriceSchedules?.Get(_product?.DefaultPriceScheduleID)
        setDefaultPriceSchedule(_defaultPriceSchedule)
      }
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

    const setCurrentTabQueryParam = async () => {
      if (!query["tab"]) {
        await push({query: {...query, tab: "Details"}}, undefined, {shallow: true})
        setInitialTab("Details")
      } else {
        setInitialTab(query["tab"] as ProductDetailTab)
      }
    }

    const checkQueryParams = async () => {
      const showTabbedView = shouldShowTabbedView()
      await setCurrentTabQueryParam()
      setShowTabbedView(showTabbedView)
      setLoading(false)
    }
    if (isReady) {
      checkQueryParams()
    }
  }, [isReady, query, push])

  return {product, defaultPriceSchedule, loading, showTabbedView, initialTab}
}
