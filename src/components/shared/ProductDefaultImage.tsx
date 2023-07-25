import {Image, ImageProps} from "@chakra-ui/react"
import {useMemo, FC} from "react"
import {ILineItemProduct} from "types/ordercloud/ILineItemProduct"
import {IProduct} from "types/ordercloud/IProduct"

const PRODUCT_DEFAULT_IMAGE__FALLBACK_URL = "/raster/dummy-image-square.jpg"

interface IProductDefaultImage extends Omit<ImageProps, "alt" | "src" | "title"> {
  product: IProduct | ILineItemProduct
  preferThumbnail?: boolean
}

const ProductDefaultImage: FC<IProductDefaultImage> = ({product, preferThumbnail = true, ...imageProps}) => {
  const loadFallbackImage = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = PRODUCT_DEFAULT_IMAGE__FALLBACK_URL
  }

  const firstImage = useMemo(() => {
    if (product && product.xp && product.xp.Images && product.xp.Images.length) {
      return product.xp.Images[0]
    }
  }, [product])

  const sourceUrl = useMemo(() => {
    if (!firstImage) return PRODUCT_DEFAULT_IMAGE__FALLBACK_URL
    if (preferThumbnail) {
      return firstImage?.ThumbnailUrl || firstImage?.Url || PRODUCT_DEFAULT_IMAGE__FALLBACK_URL
    } else {
      return firstImage?.Url || firstImage?.ThumbnailUrl || PRODUCT_DEFAULT_IMAGE__FALLBACK_URL
    }
  }, [firstImage, preferThumbnail])

  return (
    <Image
      boxSize="75px"
      objectFit="scale-down"
      rounded="sm"
      shadow="sm"
      src={sourceUrl}
      alt={product.Name}
      title={`Default Image of ${product.Name}`}
      onError={loadFallbackImage}
      {...imageProps}
    />
  )
}

export default ProductDefaultImage
