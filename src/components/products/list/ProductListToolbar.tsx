import { Box, Button, chakra, Stack, Text } from "@chakra-ui/react"
import { Link } from "../../navigation/Link"
import { FC } from "react"
import DebouncedSearchInput from "../../shared/DebouncedSearchInput/DebouncedSearchInput"
import { ListViewChildrenProps } from "../../shared/ListView/ListView"
import ListViewMetaInfo from "../../shared/ListViewMetaInfo/ListViewMetaInfo"
import ProductListActions from "./ProductListActions"
import ProductStatusFilter from "./ProductStatusFilter"

interface ProductListToolbarProps extends Omit<ListViewChildrenProps, "renderContent"> {
  onBulkPromote: () => void
  onBulkEdit: () => void
}

const ProductListToolbar: FC<ProductListToolbarProps> = ({
  meta,
  viewModeToggle,
  updateQuery,
  onBulkPromote,
  onBulkEdit,
  filterParams,
  queryParams,
  selected
}) => {
  const cfProductListActions = chakra(ProductListActions)
  return (
    <>
      <Stack wrap="nowrap" w="100%" direction={["column", "column", "column", "row"]} id="product-list-toolbar" mt={2}>
        <DebouncedSearchInput
          label="Search products"
          value={queryParams["Search"]}
          onSearch={updateQuery("s", true)}
        />
        <ProductStatusFilter value={filterParams["Active"]} onChange={updateQuery("active", true)} />
        <cfProductListActions selected={selected} onBulkPromote={onBulkPromote} onBulkEdit={onBulkEdit} />
        {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
        {viewModeToggle}
        {/* <Box order={[0, 0, 0, 1]} mt={0}> */}
        <Button variant="solid" colorScheme="primary" mb={3} as={Link} href="/products/new">
          Create Product
        </Button>
        {/* </Box> */}
      </Stack>
    </>
  )
}

export default ProductListToolbar
