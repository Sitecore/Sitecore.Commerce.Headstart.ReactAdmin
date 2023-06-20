import {ProductDetailTab} from "@/components/products/detail/ProductDetail"
import { Console } from "console"
import {useRouter} from "next/router"
import {PriceSchedules, Products, Spec, SpecOption, SpecProductAssignment, Specs, Variant, ProductFacets} from "ordercloud-javascript-sdk"
import {useState, useEffect} from "react"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {IProduct} from "types/ordercloud/IProduct"
import { ISpec } from "types/ordercloud/ISpec"
import { IVariant } from "types/ordercloud/IVariant"
import {IProductFacet} from "types/ordercloud/IProductFacet"

export function useProductDetail() {
  const {isReady, query, push} = useRouter()
  const [product, setProduct] = useState(null as IProduct)
  const [defaultPriceSchedule, setDefaultPriceSchedule] = useState(null as IPriceSchedule)
  const [specs, setSpecs] = useState(null as ISpec[])
  const [variants, setVariants] = useState(null as IVariant[])
  const [facets, setFacets] = useState([] as IProductFacet[])
  const [showTabbedView, setShowTabbedView] = useState(true)
  const [loading, setLoading] = useState(true)
  const [initialTab, setInitialTab] = useState("Details" as ProductDetailTab)

  useEffect(() => {
    (async () => {
      const _facets = await ProductFacets.List<IProductFacet>({pageSize: 100})
      setFacets(_facets.Items)
    })()

    const getProduct = async () => {
      const _product = await fetchProduct();
      if (_product) {
        await fetchDefaultPriceSchedule(_product);
        await fetchSpecs(_product);
        await fetchVariants(_product);
        setProduct(_product);
      }
    };

    const fetchProduct = async () => {
      return await Products.Get<IProduct>(query.productid.toString());
    };

    const fetchDefaultPriceSchedule = async (_product: IProduct) => {
      if (_product?.DefaultPriceScheduleID) {
        const _defaultPriceSchedule = await PriceSchedules?.Get(_product?.DefaultPriceScheduleID);
        setDefaultPriceSchedule(_defaultPriceSchedule);
      }
    };

    const fetchSpecs = async (_product: IProduct) => {
      if (_product?.SpecCount) {
        const listOptions = {
          filters: { ProductID: _product?.ID },
          pageSize: 100,
        };
        const _specAssignments = await Specs?.ListProductAssignments(listOptions);
        if (_specAssignments?.Items) {
          const _specs = await fetchSpecsFromAssignments(_specAssignments.Items);
          setSpecs(_specs);
        }
      }
    };

    const fetchSpecsFromAssignments = async (items: Array<SpecProductAssignment>) => {
      const specs = await Promise.all(
        items.map(async (item) => {
          const _spec = await Specs.Get<ISpec>(item.SpecID);
          return _spec;
        }),
      );
      return specs;
    };

    const fetchVariants = async (_product: IProduct) => {
      if (_product?.VariantCount) {
        const _variants = await Products?.ListVariants(_product?.ID);
        if (_variants?.Items) {
          setVariants(_variants.Items);
        }
      }
    };

    if (query.productid) {
      getProduct();
    }
  }, [query.productid]);

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

  return {product, defaultPriceSchedule, specs, variants, facets, loading, showTabbedView, initialTab}
}
