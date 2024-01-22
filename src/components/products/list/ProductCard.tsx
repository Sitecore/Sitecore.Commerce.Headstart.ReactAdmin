import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Heading,
  Image,
  Text
} from "@chakra-ui/react"
import {Product} from "ordercloud-javascript-sdk"
import {textHelper} from "utils/text.utils"
import {Link} from "@chakra-ui/next-js"

interface ProductCardProps {
  product: Product
  selected: boolean
  onProductSelected: (productId: string, selected: boolean) => void
  renderProductActions?: (product: Product) => React.ReactElement | React.ReactElement[] | string
}
const ProductCard = (props: ProductCardProps) => {
  const {product, renderProductActions} = props

  return (
    <Card variant={"levitating"} h="100%">
      <CardHeader
        bg="white"
        display="flex"
        flexFlow="row nowrap"
        alignItems={"start"}
        pos="relative"
        borderTopRadius={"md"}
      >
        <Checkbox
          borderColor={"blackAlpha.300"}
          isChecked={props.selected}
          onChange={(e) => props.onProductSelected(product.ID, e.target.checked)}
        />
        <Image
          mx="auto"
          minH={"150px"}
          fontSize={0}
          src={
            typeof product?.xp?.Images != "undefined" && product?.xp?.Images?.length > 0
              ? product?.xp?.Images[0]?.ThumbnailUrl || product?.xp?.Images[0]?.Url || product?.xp?.Images[0]?.url
              : "/raster/dummy-image-square.jpg"
          }
          alt="product image"
          width="175px"
        />
        <Badge
          pos="absolute"
          variant={"solid"}
          bottom={3}
          right={3}
          fontSize="xxs"
          colorScheme={product.Active ? "success" : "danger"}
        >
          {product.Active ? "Active" : "Inactive"}
        </Badge>
        <Box mt={-3} mr={-3} pl={3}>
          {renderProductActions && renderProductActions(product)}
        </Box>
      </CardHeader>
      <CardBody>
        <Heading as="h3" fontSize="lg">
          <Text as="span" noOfLines={1}>
            {product.Name}
          </Text>
        </Heading>
        <Text as="a" noOfLines={2} fontSize="small" fontWeight={"normal"}>
          {textHelper.stripHTML(product.Description)}
        </Text>
      </CardBody>
      <CardFooter w="100%" pt="0">
        <Button as={Link} w="full" variant="outline" colorScheme="accent" href={"/products/" + product.ID}>
          View Product
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
