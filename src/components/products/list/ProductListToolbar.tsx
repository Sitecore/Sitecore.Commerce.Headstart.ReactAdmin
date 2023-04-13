import { Box, Button, chakra, Flex, HStack, Stack, Text } from "@chakra-ui/react"
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

  return (
    <>
      <Flex wrap="nowrap" w="100%" direction={["column", "column", "column", "row"]} id="product-list-toolbar" mb={4} gap={2}>
        <DebouncedSearchInput
          label="Search products"
          value={queryParams["Search"]}
          onSearch={updateQuery("s", true)}
        />
        <ProductStatusFilter value={filterParams["Active"]} onChange={updateQuery("active", true)} />
        <ProductListActions selected={selected} onBulkPromote={onBulkPromote} onBulkEdit={onBulkEdit} />
        <HStack ml="auto">
          {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
          {viewModeToggle}
          <Button variant="solid" size="sm" colorScheme="primary" as={Link} href="/products/new">
            Create Product
          </Button>
        </HStack>
      </Flex>
    </>
  )
}

export default ProductListToolbar
