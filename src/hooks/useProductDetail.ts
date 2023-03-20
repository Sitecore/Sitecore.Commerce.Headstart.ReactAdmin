import {useRouter} from "next/router"
import {Products} from "ordercloud-javascript-sdk"
import {useState, useEffect} from "react"
import {IProduct} from "types/ordercloud/IProduct"

export function useProductDetail() {
  const router = useRouter()
  const [product, setProduct] = useState(null as IProduct)

  useEffect(() => {
    const getProduct = async () => {
      const _product = await Products.Get<IProduct>(router.query.productid.toString())
      setProduct(_product)
    }

    if (router.query.productid) {
      getProduct()
    }
  }, [router.query.productid])

  return {product}
}
