import {Text, Tbody, Td, Tr, Box, Grid, GridItem, Checkbox} from "@chakra-ui/react"
import {useEffect, useState} from "react"
import {Product} from "ordercloud-javascript-sdk"
import {ProductXPs} from "lib/types/ProductXPs"
import ProductCard from "./ProductCard"

interface ProductGridProps {
  products: Product[]
  selectedProductIds: string[]
  onProductSelected: (productId: string, selected: boolean) => void
  onToggleSelectAllProducts: () => void
}
const ProductGrid = (props: ProductGridProps) => {
  const [componentProducts, setComponentProducts] = useState<Product<ProductXPs>[]>(props.products)

  useEffect(() => {
    setComponentProducts(props.products)
  }, [props.products])

  return (
    <>
      {componentProducts ? (
        <Tbody alignContent={"center"}>
          <Tr>
            <Td colSpan={7}>
              <Checkbox
                marginLeft={2}
                marginBottom={4}
                isChecked={props.products.length === props.selectedProductIds.length}
                onChange={() => props.onToggleSelectAllProducts()}
              >
                Select All
              </Checkbox>
              <Grid as="section" templateColumns="repeat(3, 1fr)" templateRows="(3, 1fr)" gap={4} w="full" width="100%">
                {componentProducts && componentProducts.length > 0 ? (
                  componentProducts.map((p) => (
                    <GridItem
                      colSpan={1}
                      rowSpan={1}
                      bg="gridCellBg"
                      w="full"
                      width="100%"
                      rounded="lg"
                      key={p.ID}
                      borderStyle="none"
                    >
                      <ProductCard
                        product={p}
                        selected={props.selectedProductIds.includes(p.ID)}
                        onProductSelected={props.onProductSelected}
                      />
                    </GridItem>
                  ))
                ) : (
                  <Text p={3}>No Products found</Text>
                )}
              </Grid>
            </Td>
          </Tr>
        </Tbody>
      ) : (
        <Box>
          <Text fontWeight={"bold"} p={3} float={"left"}>
            {componentProducts.length} out of {componentProducts.length}
            Products
          </Text>
        </Box>
      )}
    </>
  )
}
export default ProductGrid
