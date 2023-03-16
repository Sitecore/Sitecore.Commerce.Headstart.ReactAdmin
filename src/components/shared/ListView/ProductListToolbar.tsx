import {Box, Button, Stack} from "@chakra-ui/react"
import {FC} from "react"
import {ListViewChildrenProps} from "./ListView"
import ProductFilters from "./ProductFilters"
import ProductSearch from "./ProductSearch"

interface ProductListToolbarProps extends Omit<ListViewChildrenProps, "children"> {}

const ProductListToolbar: FC<ProductListToolbarProps> = ({
  metaInformationDisplay,
  viewModeToggle,
  updateQuery,
  queryParams
}) => {
  return (
    <Stack direction="row" mb={5}>
      <ProductSearch value={queryParams["Search"]} onSearch={updateQuery("s")} />
      <ProductFilters />
      <Box as="span" flexGrow="1"></Box>
      {metaInformationDisplay}
      <Box as="span" width="2"></Box>
      {viewModeToggle}
      <Button colorScheme="green">Create Product</Button>
    </Stack>
  )
}

export default ProductListToolbar
