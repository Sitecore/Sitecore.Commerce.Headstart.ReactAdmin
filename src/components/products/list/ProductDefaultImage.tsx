import {Image, ImageProps} from "@chakra-ui/react"
import {useMemo, FC} from "react"
import {IProduct} from "types/ordercloud/IProduct"

const PRODUCT_DEFAULT_IMAGE__FALLBACK_URL =
  "https://mss-p-006-delivery.stylelabs.cloud/api/public/content/4fc742feffd14e7686e4820e55dbfbaa"

interface IProductDefaultImage extends Omit<ImageProps, "alt" | "src" | "title"> {
  product: IProduct
}

const ProductDefaultImage: FC<IProductDefaultImage> = ({product, ...imageProps}) => {
  const value = useMemo(() => {
    if (product && product.xp && product.xp.Images) {
      return product.xp.Images
    }
  }, [product])

  const sourceUrl = useMemo(() => {
    return value && value.length ? value[0]?.ThumbnailUrl ?? value[0]?.Url : PRODUCT_DEFAULT_IMAGE__FALLBACK_URL
  }, [value])

  return <Image src={sourceUrl} alt={sourceUrl} title={`Default Image of ${product.Name}`} {...imageProps} />
}

export default ProductDefaultImage
