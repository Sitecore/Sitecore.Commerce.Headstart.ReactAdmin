import {Box, Button, Stack} from "@chakra-ui/react"
import {FC} from "react"
import DebouncedSearchInput from "../../shared/DebouncedSearchInput/DebouncedSearchInput"
import {ListViewChildrenProps} from "../../shared/ListView/ListView"
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
      <Stack direction="row" mb={5}>
        <DebouncedSearchInput label="Search products" value={queryParams["Search"]} onSearch={updateQuery("s", true)} />
        <ProductStatusFilter value={filterParams["Active"]} onChange={updateQuery("active", true)} />
        <ProductListActions selected={selected} onBulkPromote={onBulkPromote} onBulkEdit={onBulkEdit} />
        <Box as="span" flexGrow="1"></Box>
        {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
        <Box as="span" width="2"></Box>
        {viewModeToggle}
        <Button variant="primaryButton">Create Product</Button>
      </Stack>
    </>
  )
}

export default ProductListToolbar
