import {Box, Button, Container, Heading, Icon, Tag, Text, VStack, useDisclosure} from "@chakra-ui/react"
import {Products} from "ordercloud-javascript-sdk"
import {useCallback, useState} from "react"
import {IProduct} from "types/ordercloud/IProduct"
import {textHelper} from "utils"
import {DataTableColumn} from "../../shared/DataTable/DataTable"
import ListView, {ListViewGridOptions, ListViewTableOptions} from "../../shared/ListView/ListView"
import ProductBulkEditModal from "../modals/ProductBulkEditModal"
import ProductDeleteModal from "../modals/ProductDeleteModal"
import ProductPromotionModal from "../modals/ProductPromotionModal"
import ProductActionMenu from "./ProductActionMenu"
import ProductCard from "./ProductCard"
import ProductListToolbar from "./ProductListToolbar"
import ProductDefaultImage from "../../shared/ProductDefaultImage"
import {TbCactus} from "react-icons/tb"
import {Link} from "@chakra-ui/next-js"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

const ProductQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const ProductFilterMap = {
  active: "Active"
}

const IdColumn: DataTableColumn<IProduct> = {
  header: "Product ID",
  accessor: "ID",
  width: "15%",
  cell: ({row, value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const ImageColumn: DataTableColumn<IProduct> = {
  header: "Image",
  accessor: "xp.Images",
  align: "center",
  cell: ({row, value}) => (
    <Box width="50px" display="inline-block">
      <ProductDefaultImage product={row.original} fit="cover" rounded="6" />
    </Box>
  )
}

const NameColumn: DataTableColumn<IProduct> = {
  header: "Product Name",
  accessor: "Name",
  minWidth: "200px",
  cell: ({row, value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const DescriptionColumn: DataTableColumn<IProduct> = {
  header: "Description",
  accessor: "Description",
  cell: ({row, value}) => (
    <Text w="100%" maxW="400px" noOfLines={2} fontSize="xs" title={value}>
      {textHelper.stripHTML(value)}
    </Text>
  )
}

const StatusColumn: DataTableColumn<IProduct> = {
  header: "Status",
  accessor: "Active",
  width: "1%",
  align: "center",
  cell: ({row, value}) => <Tag colorScheme={value ? "success" : "danger"}>{value ? "Active" : "Inactive"}</Tag>,
  sortable: true
}

const InventoryColumn: DataTableColumn<IProduct> = {
  header: "Inventory",
  accessor: "Inventory.QuantityAvailable",
  align: "right",
  width: "1%"
}

const ProductTableOptions: ListViewTableOptions<IProduct> = {
  responsive: {
    base: [IdColumn, NameColumn],
    md: [IdColumn, NameColumn, StatusColumn],
    lg: [IdColumn, ImageColumn, NameColumn, StatusColumn],
    xl: [IdColumn, ImageColumn, NameColumn, DescriptionColumn, StatusColumn, InventoryColumn]
  }
}

const ProductGridOptions: ListViewGridOptions<IProduct> = {
  renderGridItem: (p, index, renderActions, selected, onSelectChange) => (
    <ProductCard
      key={index}
      product={p}
      selected={selected}
      renderProductActions={renderActions}
      onProductSelected={onSelectChange}
    />
  )
}

const ProductList = () => {
  const [actionProduct, setActionProduct] = useState<IProduct>()
  const deleteDisclosure = useDisclosure()
  const promoteDisclosure = useDisclosure()
  const editDisclosure = useDisclosure()

  const renderProductActionsMenu = useCallback(
    (product: IProduct) => {
      return (
        <ProductActionMenu
          product={product}
          onOpen={() => setActionProduct(product)}
          // onClose={() => setActionProduct(undefined)}
          onDelete={deleteDisclosure.onOpen}
          onPromote={promoteDisclosure.onOpen}
        />
      )
    },
    [deleteDisclosure.onOpen, promoteDisclosure.onOpen]
  )

  const resolveProductDetailHref = (product: IProduct) => {
    return `/products/${product.ID}?tab=Details`
  }

  const noDataMessage = (
    <Box p={6} display="flex" flexDirection={"column"} alignItems={"center"} justifyContent={"center"} minH={"xs"}>
      <Icon as={TbCactus} fontSize={"5xl"} strokeWidth={"2px"} color="accent.500" />
      <Heading colorScheme="secondary" fontSize="xl">
        <VStack>
          <Text>No products yet</Text>
          <ProtectedContent hasAccess={appPermissions.ProductManager}>
            <Link href="/products/new">
              <Button variant="solid" size="sm" colorScheme="primary">
                Create one now
              </Button>
            </Link>
          </ProtectedContent>
        </VStack>
      </Heading>
    </Box>
  )

  return (
    <ListView<IProduct>
      service={Products.List}
      queryMap={ProductQueryMap}
      filterMap={ProductFilterMap}
      itemActions={renderProductActionsMenu}
      itemHrefResolver={resolveProductDetailHref}
      tableOptions={ProductTableOptions}
      gridOptions={ProductGridOptions}
      noDataMessage={noDataMessage}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <ProductListToolbar
            {...listViewChildProps}
            onBulkEdit={editDisclosure.onOpen}
            onBulkPromote={() => {
              setActionProduct(undefined)
              promoteDisclosure.onOpen()
            }}
          />
          {renderContent}
          <ProductBulkEditModal
            onComplete={listViewChildProps.upsertItems}
            products={items ? items.filter((p) => listViewChildProps.selected.includes(p.ID)) : []}
            disclosure={editDisclosure}
          />
          <ProductDeleteModal
            onComplete={listViewChildProps.removeItems}
            products={
              actionProduct
                ? [actionProduct]
                : items
                ? items.filter((p) => listViewChildProps.selected.includes(p.ID))
                : []
            }
            disclosure={deleteDisclosure}
          />
          <ProductPromotionModal
            products={
              actionProduct
                ? [actionProduct]
                : items
                ? items.filter((p) => listViewChildProps.selected.includes(p.ID))
                : []
            }
            disclosure={promoteDisclosure}
          />
        </Container>
      )}
    </ListView>
  )
}

export default ProductList
