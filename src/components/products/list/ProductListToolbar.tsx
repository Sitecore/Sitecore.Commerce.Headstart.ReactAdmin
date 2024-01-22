import {Button, Flex, HStack, SimpleGrid} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import DebouncedSearchInput from "../../shared/DebouncedSearchInput/DebouncedSearchInput"
import {ListViewChildrenProps} from "../../shared/ListView/ListView"
import ListViewMetaInfo from "../../shared/ListViewMetaInfo/ListViewMetaInfo"
import ProductListActions from "./ProductListActions"
import ProductStatusFilter from "./ProductStatusFilter"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

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
    <Flex
      wrap="wrap"
      w="100%"
      direction={["column", "column", "column", "row"]}
      id="product-list-toolbar"
      mb={4}
      gap={2}
    >
      <DebouncedSearchInput label="Search products" value={queryParams["Search"]} onSearch={updateQuery("s", true)} />
      <SimpleGrid gridTemplateColumns={"1fr 1fr"} gap={2} alignItems={"stretch"}>
        <ProductStatusFilter value={filterParams["Active"]} onChange={updateQuery("active", true)} />
        <ProductListActions selected={selected} onBulkPromote={onBulkPromote} onBulkEdit={onBulkEdit} />
      </SimpleGrid>
      <HStack ml="auto">
        {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
        {viewModeToggle}
        <ProtectedContent hasAccess={appPermissions.ProductManager}>
          <Link passHref href="/products/new">
            <Button as="a" variant="solid" colorScheme="primary">
              Create Product
            </Button>
          </Link>
        </ProtectedContent>
      </HStack>
    </Flex>
  )
}

export default ProductListToolbar
