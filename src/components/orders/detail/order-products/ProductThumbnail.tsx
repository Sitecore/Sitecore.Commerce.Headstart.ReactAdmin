import {ILineItemProduct} from "types/ordercloud/ILineItemProduct"
import {Image, ImageProps} from "@chakra-ui/react"

interface ProductThumbnailProps {
  product: ILineItemProduct
  imageProps?: ImageProps
}
export function ProductThumbnail({product, imageProps}: ProductThumbnailProps) {
  const loadFallbackImage = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/raster/dummy-image-square.jpg"
  }
  const image = product?.xp?.Images?.length > 0 ? product.xp.Images[0] : null
  return (
    <Image
      boxSize="75px"
      objectFit="scale-down"
      rounded="sm"
      shadow="sm"
      alt={product.Name}
      src={image?.ThumbnailUrl || image?.Url || "/raster/dummy-image-square.jpg"}
      onError={loadFallbackImage}
      {...imageProps}
    />
  )
}
