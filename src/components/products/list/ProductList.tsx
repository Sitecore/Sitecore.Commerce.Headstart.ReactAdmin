import {Container, Image, Tag, useDisclosure} from "@chakra-ui/react"
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

const ProductQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const ProductFilterMap = {
  active: "Active"
}

const ProductListTableColumns: DataTableColumn<IProduct>[] = [
  {
    header: "Product ID",
    accessor: "ID",
    cell: ({row, value}) => <Link href={`/products/${value}`}>{value}</Link>,
    sortable: true
  },
  {
    header: "Image",
    accessor: "xp.Images",
    align: "center",
    cell: ({row, value}) => (
      <Link href={"/products/" + row.original.ID}>
        <Image
          src={
            value && value.length
              ? value[0]?.ThumbnailUrl ?? value[0]?.Url
              : "https://mss-p-006-delivery.stylelabs.cloud/api/public/content/4fc742feffd14e7686e4820e55dbfbaa"
          }
          alt="product image"
          width="50px"
        />
      </Link>
    )
  },
  {
    header: "Product Name",
    accessor: "Name",
    cell: ({row, value}) => <Link href={`/products/${row.original.ID}`}>{value}</Link>,
    sortable: true
  },
  {
    header: "Description",
    accessor: "Description",
    cell: ({row, value}) =>
      textHelper.stripHTML(value).length > 40
        ? textHelper.stripHTML(value).substring(0, 40) + "..."
        : textHelper.stripHTML(value)
  },
  {
    header: "Status",
    accessor: "Active",
    cell: ({row, value}) => (
      <Tag size="sm" colorScheme={value ? "green" : "red"}>
        {value ? "Active" : "Inactive"}
      </Tag>
    ),
    sortable: true
  },
  {
    header: "Inventory",
    accessor: "Inventory.QuantityAvailable",
    align: "right"
  }
]

const ProductTableOptions: ListViewTableOptions<IProduct> = {
  columns: ProductListTableColumns
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
