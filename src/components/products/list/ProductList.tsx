import ProductCard from "@/components/products/ProductCard"
import {CheckCircleIcon, DeleteIcon, EditIcon, NotAllowedIcon, SettingsIcon} from "@chakra-ui/icons"
import {
  Badge,
  Container,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList
} from "@chakra-ui/react"
import Link from "next/link"
import {Products} from "ordercloud-javascript-sdk"
import {TbDotsVertical} from "react-icons/tb"
import {IProduct} from "types/ordercloud/IProduct"
import {textHelper} from "utils"
import {DataTableColumn} from "../../shared/DataTable/DataTable"
import ListView, {ListViewGridOptions, ListViewTableOptions} from "../../shared/ListView/ListView"
import ProductListToolbar from "./ProductListToolbar"

const ProductQueryMap = {
  s: "Search",
  sort: "SortBy"
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
            typeof value != "undefined"
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
    align: "center",
    cell: ({row, value}) => <Badge colorScheme={value ? "green" : "red"}>{value ? "Active" : "Inactive"}</Badge>,
    sortable: true
  },
  {
    header: "Inventory",
    accessor: "Inventory.QuantityAvailable",
    align: "right"
  }
]

const renderProductActionsMenu = (rowData: IProduct) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label={`Product action menu for ${rowData.Name}`}
        variant="outline"
        colorScheme="gray"
      >
        <Icon as={TbDotsVertical} mt={1} />
      </MenuButton>
      <MenuList>
        <MenuItem justifyContent="space-between">
          Edit <EditIcon />
        </MenuItem>
        <MenuItem color="blue.500" justifyContent="space-between">
          Promote <SettingsIcon />
        </MenuItem>
        <MenuItem justifyContent="space-between" color={rowData.Active ? "orange.500" : "green.500"}>
          {rowData.Active ? "Deactivate" : "Activate"}
          {rowData.Active ? <NotAllowedIcon /> : <CheckCircleIcon />}
        </MenuItem>
        <MenuDivider />
        <MenuItem justifyContent="space-between" color="red.500">
          Delete <DeleteIcon />
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

const ProductTableOptions: ListViewTableOptions<IProduct> = {
  columns: ProductListTableColumns
}

const ProductGridOptions: ListViewGridOptions<IProduct> = {
  renderGridItem: renderProductActionsMenu
}

const ProductList = () => {
  return (
    <ListView<IProduct>
      service={Products.List}
      queryMap={ProductQueryMap}
      itemActions={renderProductActionsMenu}
      tableOptions={ProductTableOptions}
      gridOptions={ProductGridOptions}
    >
      {({renderContent, ...listViewChildProps}) => (
        <Container maxW="container.2xl">
          <ProductListToolbar {...listViewChildProps} />
          {renderContent}
        </Container>
      )}
    </ListView>
  )
}

export default ProductList
