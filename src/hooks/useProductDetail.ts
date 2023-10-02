import {ProductDetailTab} from "@/components/products/detail/ProductDetail"
import {useRouter} from "next/router"
import {ProductFacets, ProductCatalogAssignment, Me} from "ordercloud-javascript-sdk"
import {useState, useEffect} from "react"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {IProduct} from "types/ordercloud/IProduct"
import {ISpec} from "types/ordercloud/ISpec"
import {IVariant} from "types/ordercloud/IVariant"
import {IProductFacet} from "types/ordercloud/IProductFacet"
import {
  fetchProduct,
  fetchDefaultPriceSchedule,
  fetchSpecs,
  fetchVariants,
  fetchOverridePriceSchedules,
  fetchProductCatalogAssignments,
  fetchProductCategoryAssignments,
  fetchInventoryRecords
} from "services/product-data-fetcher.service"
import {ICategoryProductAssignment} from "types/ordercloud/ICategoryProductAssignment"
import {IInventoryRecord} from "types/ordercloud/IInventoryRecord"

export function useProductDetail() {
  const {isReady, query, push} = useRouter()
  const [defaultOwnerId, setDefaultOwnerId] = useState(null as string)
  const [inventoryRecords, setInventoryRecords] = useState([] as IInventoryRecord[])
  const [product, setProduct] = useState(null as IProduct)
  const [defaultPriceSchedule, setDefaultPriceSchedule] = useState(null as IPriceSchedule)
  const [overridePriceSchedules, setOverridePriceSchedules] = useState([] as IPriceSchedule[])
  const [specs, setSpecs] = useState([] as ISpec[])
  const [variants, setVariants] = useState([] as IVariant[])
  const [facets, setFacets] = useState([] as IProductFacet[])
  const [loading, setLoading] = useState(true)
  const [initialTab, setInitialTab] = useState("Details" as ProductDetailTab)
  const [catalogAssignments, setCatalogAssignments] = useState([] as ProductCatalogAssignment[])
  const [categoryAssignments, setCategoryAssignments] = useState([] as ICategoryProductAssignment[])

  useEffect(() => {
    const getFacets = async () => {
      const _facets = await ProductFacets.List<IProductFacet>({pageSize: 100})
      setFacets(_facets.Items)
    }

    const getCatalogsAndCategories = async (_product: IProduct) => {
      const catalogAssignments = await fetchProductCatalogAssignments(_product)
      const categoryAssignments = await fetchProductCategoryAssignments(catalogAssignments)
      setCategoryAssignments(categoryAssignments)
      setCatalogAssignments(catalogAssignments)
    }

    const fetchDefaultOwnerId = async () => {
      const me = await Me.Get()
      const _defaultOwnerId = me.Supplier?.ID || me.Seller?.ID
      setDefaultOwnerId(_defaultOwnerId)
    }

    const getProduct = async () => {
      const _product = await fetchProduct(query.productid.toString())
      if (_product) {
        await Promise.all([
          fetchDefaultPriceSchedule(_product).then((response) => setDefaultPriceSchedule(response)),
          fetchSpecs(_product).then((response) => setSpecs(response)),
          fetchVariants(_product).then((response) => setVariants(response)),
          fetchOverridePriceSchedules(_product).then((response) => setOverridePriceSchedules(response)),
          getCatalogsAndCategories(_product),
          fetchInventoryRecords(_product).then((response) => setInventoryRecords(response))
        ])
        setProduct(_product)
      }
    }

    const initializeData = async () => {
      const requests = [getFacets()]
      if (query.productid) {
        requests.push(getProduct())
      } else {
        requests.push(fetchDefaultOwnerId())
      }
      await Promise.all(requests)
      setLoading(false)
    }

    if (isReady) {
      initializeData()
    }
  }, [query.productid, isReady])

  useEffect(() => {
    const setCurrentTabQueryParam = async () => {
      if (!query["tab"]) {
        await push({query: {...query, tab: "Details"}}, undefined, {shallow: true})
        setInitialTab("Details")
      } else {
        setInitialTab(query["tab"] as ProductDetailTab)
      }
    }

    const checkQueryParams = async () => {
      await setCurrentTabQueryParam()
    }
    if (isReady) {
      checkQueryParams()
    }
  }, [isReady, query, push])

  return {
    product,
    inventoryRecords,
    defaultOwnerId,
    defaultPriceSchedule,
    overridePriceSchedules,
    specs,
    variants,
    facets,
    loading,
    initialTab,
    catalogAssignments,
    categoryAssignments
  }
}
