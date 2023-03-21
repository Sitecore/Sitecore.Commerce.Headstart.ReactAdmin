import {Image} from "@chakra-ui/react"
import {useMemo} from "react"

const ProductThumbnail = ({product, width = "50px"}) => {
  const value = useMemo(() => {
    if (product && product.xp && product.xp.Images) {
      return product.xp.Images
    }
  }, [product])
  return (
    <Image
      src={
        value && value.length
          ? value[0]?.ThumbnailUrl ?? value[0]?.Url
          : "https://mss-p-006-delivery.stylelabs.cloud/api/public/content/4fc742feffd14e7686e4820e55dbfbaa"
      }
      alt="product image"
      width={width}
    />
  )
}

export default ProductThumbnail
