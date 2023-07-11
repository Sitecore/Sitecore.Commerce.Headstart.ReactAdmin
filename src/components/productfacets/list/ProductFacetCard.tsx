import {Checkbox, Flex, Heading, Spacer, Text, Tooltip, VStack} from "@chakra-ui/react"
import {ProductFacet} from "ordercloud-javascript-sdk"
import Link from "next/link"

interface ProductFacetCardProps {
  productFacet: ProductFacet
  selected: boolean
  onProductFacetSelected: (productFacetId: string, selected: boolean) => void
  renderProductFacetActions?: (productFacet: ProductFacet) => React.ReactElement | React.ReactElement[] | string
}
const ProductFacetCard = (props: ProductFacetCardProps) => {
  const {productFacet, renderProductFacetActions} = props

  return (
    <VStack
      h="full"
      justifyContent="space-between"
      p={4}
      backgroundColor="Background"
      border="1px solid"
      borderColor="blackAlpha.200"
      borderRadius="lg"
      shadow="md"
    >
      <Flex w="full" alignItems={"flex-start"}>
        <Checkbox
          isChecked={props.selected}
          onChange={(e) => props.onProductFacetSelected(productFacet.ID, e.target.checked)}
        />
        <Spacer />
        {renderProductFacetActions && renderProductFacetActions(productFacet)}
      </Flex>
      <VStack flex="1" justifyContent="flex-end" alignItems="flex-start" w="full">
        <Link passHref style={{cursor: "pointer"}} href={"/settings/productfacets/" + productFacet.ID}>
          <Heading as="a" fontSize="lg">
            <Tooltip label={productFacet.Name} placement="top">
              <Text as="span" noOfLines={1}>
                {productFacet.Name}
              </Text>
            </Tooltip>
          </Heading>
        </Link>
        <Text fontSize="md">{productFacet.xp?.Options?.join(", ")}</Text>
      </VStack>
    </VStack>
  )
}

export default ProductFacetCard
