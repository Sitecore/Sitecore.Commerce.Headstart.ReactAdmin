import {Badge, Checkbox, Flex, Heading, Image, Spacer, Text, Tooltip, useColorModeValue, VStack} from "@chakra-ui/react"
import {Product} from "ordercloud-javascript-sdk"
import {textHelper} from "utils/text.utils"
import {Link} from "../../navigation/Link"

interface ProductCardProps {
  product: Product
  selected: boolean
  onProductSelected: (productId: string, selected: boolean) => void
  renderProductActions?: (product: Product) => React.ReactElement | React.ReactElement[] | string
}
const ProductCard = (props: ProductCardProps) => {
  const {product, renderProductActions} = props
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")

  return (
    <VStack
      h="full"
      justifyContent="space-between"
      p={4}
      backgroundColor="Background"
      border="1px"
      borderColor="blackAlpha.300"
      borderRadius="lg"
      shadow="xl"
    >
      <Flex w="full" alignItems={"flex-start"}>
        <Checkbox isChecked={props.selected} onChange={(e) => props.onProductSelected(product.ID, e.target.checked)} />
        <Spacer />
        <Link href={"/products/" + product.ID}>
          <Image
            src={
              typeof product?.xp?.Images != "undefined" && product?.xp?.Images?.length > 0
                ? product?.xp?.Images[0]?.ThumbnailUrl || product?.xp?.Images[0]?.Url || product?.xp?.Images[0]?.url
                : "/images/dummy-image-square.jpg"
            }
            alt="product image"
            width="175px"
          />
        </Link>
        <Spacer />
        {renderProductActions && renderProductActions(product)}
      </Flex>
      <VStack flex="1" justifyContent="flex-end" alignItems="flex-start" w="full">
        {/* <Heading fontSize="xx-small" fontWeight='normal' color='gray.300' >NEW ARRIVALS</Heading>  */}
        {/* <HStack> */}
        <Badge colorScheme={product.Active ? "green" : "red"}>{product.Active ? "Active" : "Inactive"}</Badge>
        <Link href={"/products/" + product.ID}>
          <Heading as="h3" fontSize="lg">
            <Tooltip label={product.Name} placement="top">
              <Text as="span" noOfLines={1}>
                {product.Name}
              </Text>
            </Tooltip>
          </Heading>
        </Link>
        {/* </HStack> */}
        <Link href={"/products/" + product.ID}>
          <Text noOfLines={2} fontSize="small">
            {textHelper.stripHTML(product.Description)}
          </Text>
        </Link>
      </VStack>
    </VStack>
  )
}

export default ProductCard
