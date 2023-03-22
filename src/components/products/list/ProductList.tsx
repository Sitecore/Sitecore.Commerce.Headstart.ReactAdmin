import {Box, Container, Image, Tag, Text, useColorMode, useColorModeValue, useDisclosure} from "@chakra-ui/react"
import Link from "next/link"
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
import ProductThumbnail from "./ProductDefaultImage"
import ProductDefaultImage from "./ProductDefaultImage"

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
    <Link href={`/products/${value}`}>
      <Text as="a" noOfLines={2} title={value}>
        {value}
      </Text>
    </Link>
  ),
  sortable: true
}

const ImageColumn: DataTableColumn<IProduct> = {
  header: "Image",
  accessor: "xp.Images",
  align: "center",
  cell: ({row, value}) => (
    <Link passHref href={"/products/" + row.original.ID}>
      <Box as="a" width="50px" display="inline-block">
        <ProductDefaultImage product={row.original} w="50px" h="50px" fit="cover" rounded="6" />
      </Box>
    </Link>
  )
}

const NameColumn: DataTableColumn<IProduct> = {
  header: "Product Name",
  accessor: "Name",
  minWidth: "200px",
  cell: ({row, value}) => (
    <Link passHref href={`/products/${row.original.ID}`}>
      <Text as="a" noOfLines={2} title={value}>
        {value}
      </Text>
    </Link>
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
  cell: ({row, value}) => (
    <Tag size="sm" colorScheme={value ? "green" : "red"}>
      {value ? "Active" : "Inactive"}
    </Tag>
  ),
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

  return (
    <ListView<IProduct>
      service={Products.List}
      queryMap={ProductQueryMap}
      filterMap={ProductFilterMap}
      itemActions={renderProductActionsMenu}
      tableOptions={ProductTableOptions}
      gridOptions={ProductGridOptions}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="container.2xl">
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
