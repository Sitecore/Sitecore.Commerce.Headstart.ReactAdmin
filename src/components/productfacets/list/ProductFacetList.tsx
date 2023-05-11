import {Box, Container, Text, useDisclosure} from "@chakra-ui/react"
import {ProductFacets} from "ordercloud-javascript-sdk"
import {useCallback, useState} from "react"
import {IProductFacet} from "types/ordercloud/IProductFacet"
import {DataTableColumn} from "../../shared/DataTable/DataTable"
import ListView, {ListViewGridOptions, ListViewTableOptions} from "../../shared/ListView/ListView"
import ProductFacetDeleteModal from "../modals/ProductFacetDeleteModal"
import ProductFacetActionMenu from "./ProductFacetActionMenu"
import ProductFacetCard from "./ProductFacetCard"
import ProductFacetListToolbar from "./ProductFacetListToolbar"

const ProductFacetQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const IDColumn: DataTableColumn<IProductFacet> = {
  header: "ID",
  accessor: "ID",
  width: "20%",
  cell: ({value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const NameColumn: DataTableColumn<IProductFacet> = {
  header: "Name",
  accessor: "Name",
  width: "20%",
  cell: ({value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const OptionsColumn: DataTableColumn<IProductFacet> = {
  header: "Facet Options",
  accessor: "xp.Options",
  width: "60%",
  sortable: false
}

const ProductFacetTableOptions: ListViewTableOptions<IProductFacet> = {
  responsive: {
    base: [IDColumn, NameColumn],
    md: [IDColumn, NameColumn, OptionsColumn],
    lg: [IDColumn, NameColumn, OptionsColumn],
    xl: [IDColumn, NameColumn, OptionsColumn]
  }
}

const ProductFacetGridOptions: ListViewGridOptions<IProductFacet> = {
  renderGridItem: (productFacet, index, renderActions, selected, onSelectChange) => (
    <ProductFacetCard
      key={index}
      productFacet={productFacet}
      selected={selected}
      renderProductFacetActions={renderActions}
      onProductFacetSelected={onSelectChange}
    />
  )
}

const ProductFacetList = () => {
  const [actionProductFacet, setActionProductFacet] = useState<IProductFacet>()
  const deleteDisclosure = useDisclosure()

  const renderProductFacetActionsMenu = useCallback(
    (productFacet: IProductFacet) => {
      return (
        <ProductFacetActionMenu
          productFacet={productFacet}
          onOpen={() => setActionProductFacet(productFacet)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [deleteDisclosure.onOpen]
  )

  const resolveProductFacetDetailHref = (facet: IProductFacet) => {
    return `/settings/productfacets/${facet.ID}`
  }

  return (
    <ListView<IProductFacet>
      service={ProductFacets.List}
      queryMap={ProductFacetQueryMap}
      itemHrefResolver={resolveProductFacetDetailHref}
      itemActions={renderProductFacetActionsMenu}
      tableOptions={ProductFacetTableOptions}
      gridOptions={ProductFacetGridOptions}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <ProductFacetListToolbar {...listViewChildProps} />
          </Box>
          {renderContent}
          <ProductFacetDeleteModal
            onComplete={listViewChildProps.removeItems}
            productFacets={
              actionProductFacet
                ? [actionProductFacet]
                : items
                ? items.filter((productFacet) => listViewChildProps.selected.includes(productFacet.ID))
                : []
            }
            disclosure={deleteDisclosure}
          />
        </Container>
      )}
    </ListView>
  )
}

export default ProductFacetList
