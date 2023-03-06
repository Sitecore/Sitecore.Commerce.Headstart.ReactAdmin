import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {Checkbox, Flex, Heading, Image, Spacer, Text, Tooltip, VStack, useColorModeValue} from "@chakra-ui/react"
import {textHelper} from "lib/utils/text.utils"
import {Product} from "ordercloud-javascript-sdk"
import {Link} from "../navigation/Link"

interface ProductCardProps {
  product: Product
  selected: boolean
  onProductSelected: (productId: string, selected: boolean) => void
}
const ProductCard = (props: ProductCardProps) => {
  const product = props.product
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")

  return (
    <VStack
      h="full"
      justifyContent="space-between"
      p={2}
      backgroundColor="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      shadow="xl"
    >
      <Flex w="full" alignItems={"flex-start"}>
        <Checkbox isChecked={props.selected} onChange={(e) => props.onProductSelected(product.ID, e.target.checked)} />
        <Spacer />
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
        <VStack>
          <p>Active</p>
          {product.Active ? <CheckIcon boxSize={6} color={okColor} /> : <CloseIcon boxSize={6} color={errorColor} />}
        </VStack>
        <Spacer />
      </Flex>
      <VStack flex="1" justifyContent="flex-end" alignItems="flex-start" p={[4, 2, 20, 6]}>
        {/* <Heading fontSize="xx-small" fontWeight='normal' color='gray.300' >NEW ARRIVALS</Heading>  */}
        <Tooltip label={product.Name}>
          <Link href={"/products/" + product.ID}>
            <Heading as="h3" fontSize="lg">
              {product.Name.length > 39 ? product.Name.substring(0, 39) + "..." : product.Name}
            </Heading>
          </Link>
        </Tooltip>
        <Link href={"/products/" + product.ID}>
          <Text fontSize="small" color="brand.500">
            {textHelper.stripHTML(product.Description).length > 40
              ? textHelper.stripHTML(product.Description).substring(0, 40) + "..."
              : textHelper.stripHTML(product.Description)}
          </Text>
        </Link>
      </VStack>
    </VStack>
  )
}

export default ProductCard
