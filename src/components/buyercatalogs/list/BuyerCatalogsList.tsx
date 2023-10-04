import {Box, Button, ButtonGroup, Container, Icon, Tag, Text, useDisclosure} from "@chakra-ui/react"
import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import Link from "next/link"
import {FC, useCallback, useMemo, useState} from "react"
import {ICatalog} from "types/ordercloud/ICatalog"
import BuyerCatalogsActionMenu from "./BuyerCatalogsActionMenu"
import BuyerCatalogsListToolbar from "./BuyerCatalogsListToolBar"
import BuyerCatalogsDeleteModal from "../modals/BuyerCatalogsDeleteModal"
import {Catalogs} from "ordercloud-javascript-sdk"

export const BuyerCatalogColorSchemeMap = {
  "": "gray",
  true: "success",
  false: "danger"
}

interface IBuyerCatalogList {
  buyerid: string
}

const buyerCategoryListCall = async (buyerID: any) => {
  const assignments = await Catalogs.ListAssignments({buyerID: buyerID})
  const catalogIds = assignments.Items.map((assignment) => assignment.CatalogID)
  if (!catalogIds.length) {
    return {Items: [], Meta: {TotalCount: 0, ItemRange: [0, 0], Page: 1, PageSize: 20}}
  }
  const response = await Catalogs.List<ICatalog>({filters: {ID: catalogIds.join("|")}})
  return response
}

const paramMap = {
  d: "Direction",
  buyerid: "BuyerID"
}

const BuyerCatalogsQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const BuyerCatalogsFilterMap = {
  active: "Active"
}

const BuyerIDColumn: DataTableColumn<ICatalog> = {
  header: "Catalog ID",
  accessor: "ID",
  cell: ({value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  )
}

const BuyerNameColumn: DataTableColumn<ICatalog> = {
  header: "Name",
  accessor: "Name"
}

const BuyerDescriptionColumn: DataTableColumn<ICatalog> = {
  header: "Description",
  accessor: "Description"
}

const BuyerOwnerIDColumn: DataTableColumn<ICatalog> = {
  header: "Owner ID",
  accessor: "OwnerID"
}

const BuyerCatalogActiveColumn: DataTableColumn<ICatalog> = {
  header: "Active",
  accessor: "Active",
  cell: ({row, value}) => (
    <Tag colorScheme={BuyerCatalogColorSchemeMap[value] || "default"}>
      <Text>{row.original.Active ? "Active" : "Non active"}</Text>
    </Tag>
  )
}

const BuyerCatalogsList: FC<IBuyerCatalogList> = ({buyerid}) => {
  const [actionBuyerCatalogs, setActionBuyerCatalogs] = useState<ICatalog>()
  const deleteDisclosure = useDisclosure()

  const renderBuyerCatalogsActionMenu = useCallback(
    (buyercatalog: ICatalog) => {
      return (
        <BuyerCatalogsActionMenu
          buyerid={buyerid}
          buyercatalog={buyercatalog}
          onOpen={() => setActionBuyerCatalogs(buyercatalog)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [buyerid, deleteDisclosure.onOpen]
  )

  const BuyerCategoryCountColumn: DataTableColumn<ICatalog> = useMemo(() => {
    return {
      header: "Category Count",
      accessor: "CategoryCount",
      skipHref: true,
      cell: ({row, value}) => (
        <Link passHref href={`/buyers/${buyerid}/catalogs/${row.original.ID}/categories`}>
          <Button as="a" variant="outline">
            Categories ({value})
          </Button>
        </Link>
      )
    }
  }, [buyerid])

  const BuyerCatalogsTableOptions: ListViewTableOptions<ICatalog> = useMemo(() => {
    return {
      responsive: {
        base: [BuyerIDColumn, BuyerNameColumn],
        md: [BuyerIDColumn, BuyerNameColumn],
        lg: [BuyerIDColumn, BuyerNameColumn, BuyerCategoryCountColumn, BuyerCatalogActiveColumn],
        xl: [
          BuyerIDColumn,
          BuyerNameColumn,
          BuyerDescriptionColumn,
          BuyerCategoryCountColumn,
          BuyerCatalogActiveColumn,
          BuyerOwnerIDColumn
        ]
      }
    }
  }, [BuyerCategoryCountColumn])

  const resolveCatalogDetailHref = useCallback(
    (c: ICatalog) => {
      return `/buyers/${buyerid}/catalogs/${c.ID}`
    },
    [buyerid]
  )

  return (
    <ListView<ICatalog>
      service={buyerCategoryListCall}
      tableOptions={BuyerCatalogsTableOptions}
      paramMap={paramMap}
      queryMap={BuyerCatalogsQueryMap}
      filterMap={BuyerCatalogsFilterMap}
      itemHrefResolver={resolveCatalogDetailHref}
      itemActions={renderBuyerCatalogsActionMenu}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <BuyerCatalogsListToolbar buyerid={buyerid} {...listViewChildProps} />
          </Box>
          {renderContent}
          <BuyerCatalogsDeleteModal
            onComplete={listViewChildProps.removeItems}
            buyercatalogs={
              actionBuyerCatalogs
                ? [actionBuyerCatalogs]
                : items
                ? items.filter((buyercatalog) => listViewChildProps.selected.includes(buyercatalog.ID))
                : []
            }
            disclosure={deleteDisclosure}
          />
        </Container>
      )}
    </ListView>
  )
}

export default BuyerCatalogsList
