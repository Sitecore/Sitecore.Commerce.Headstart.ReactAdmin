import {Box, Button, Container, Tag, Text, useDisclosure} from "@chakra-ui/react"
import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import {Buyers, Catalogs, RequiredDeep, UserGroups, Users} from "ordercloud-javascript-sdk"
import {FC, useCallback, useState} from "react"
import {IBuyer} from "types/ordercloud/IBuyer"
import {dateHelper} from "utils"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"
import {IBuyerUser} from "types/ordercloud/IBuyerUser"
import BuyerListToolbar from "./BuyerListToolBar"
import BuyerActionMenu from "./BuyerActionMenu"
import BuyerDeleteModal from "../modals/BuyerDeleteModal"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"
import {Link} from "@chakra-ui/next-js"

export const BuyerColorSchemeMap = {
  "": "gray",
  true: "success",
  false: "danger"
}

interface IBuyerListItem extends RequiredDeep<IBuyer> {
  userGroupsCount: number
  usersCount: number
  catalogsCount: number
}

const BuyerParamMap = {}

const BuyerQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const BuyerFilterMap = {
  active: "Active"
}

const IdColumn: DataTableColumn<IBuyerListItem> = {
  header: "Buyer ID",
  accessor: "ID",
  cell: ({row, value}) => (
    <Box noOfLines={2} title={value}>
      {value}
    </Box>
  )
}

const NameColumn: DataTableColumn<IBuyerListItem> = {
  header: "NAME",
  accessor: "Name",
  cell: ({row, value}) => (
    <Box noOfLines={2} title={value}>
      {value}
    </Box>
  )
}

const DefaultCatalogIDColumn: DataTableColumn<IBuyer> = {
  header: "DEFAULT CATALOG ID",
  accessor: "DefaultCatalogID"
}

const StatusColumn: DataTableColumn<IBuyerListItem> = {
  header: "STATUS",
  accessor: "Active",
  cell: ({row, value}) => (
    <Tag as="a" colorScheme={BuyerColorSchemeMap[value] || "default"}>
      <Text>{row.original.Active ? "Active" : "Non active"}</Text>
    </Tag>
  )
}

const CreatedDateColumn: DataTableColumn<IBuyerListItem> = {
  header: "CREATED DATE",
  accessor: "DateCreated",
  cell: ({value}) => dateHelper.formatDate(value)
}

const BuyerUserGroupColumn: DataTableColumn<IBuyerListItem> = {
  header: "USER GROUPS",
  skipHref: true,
  cell: ({row}) => (
    <Link href={`/buyers/${row.original.ID}/usergroups`}>
      <Button variant="outline">User Groups ({row.original.userGroupsCount})</Button>
    </Link>
  )
}

const BuyerUserColumn: DataTableColumn<IBuyerListItem> = {
  header: "USERS",
  skipHref: true,
  cell: ({row}) => (
    <Link href={`/buyers/${row.original.ID}/users`}>
      <Button variant="outline">Users ({row.original.usersCount})</Button>
    </Link>
  )
}

const BuyerCatalogColumn: DataTableColumn<IBuyerListItem> = {
  header: "CATALOGS",
  skipHref: true,
  cell: ({row}) => (
    <Link href={`/buyers/${row.original.ID}/catalogs`}>
      <Button variant="outline">Catalogs ({row.original.catalogsCount})</Button>
    </Link>
  )
}

const BuyerTableOptions: ListViewTableOptions<IBuyerListItem> = {
  responsive: {
    base: [IdColumn, NameColumn],
    md: [IdColumn, NameColumn],
    lg: [IdColumn, NameColumn],
    xl: [IdColumn, NameColumn, DefaultCatalogIDColumn, StatusColumn, CreatedDateColumn]
  }
}

const BuyerList: FC = () => {
  const canViewBuyerUsers = useHasAccess([appPermissions.BuyerUserViewer, appPermissions.BuyerUserManager])
  const canViewBuyerUserGroups = useHasAccess([
    appPermissions.BuyerUserGroupViewer,
    appPermissions.BuyerUserGroupManager
  ])
  const canViewBuyerCatalogs = useHasAccess([appPermissions.BuyerCatalogViewer, appPermissions.BuyerCatalogManager])

  if (canViewBuyerUsers && !BuyerTableOptions.responsive.xl.map((c) => c.header).includes("USERS")) {
    BuyerTableOptions.responsive.xl.push(BuyerUserColumn)
  }
  if (canViewBuyerUserGroups && !BuyerTableOptions.responsive.xl.map((c) => c.header).includes("USER GROUPS")) {
    BuyerTableOptions.responsive.xl.push(BuyerUserGroupColumn)
  }
  if (canViewBuyerCatalogs && !BuyerTableOptions.responsive.xl.map((c) => c.header).includes("CATALOGS")) {
    BuyerTableOptions.responsive.xl.push(BuyerCatalogColumn)
  }

  const buyerListCall = async (listOptions: any) => {
    const buyersList = await Buyers.List(listOptions)
    const enhancedBuyerRequests = buyersList.Items.map(async (buyer) => {
      const requests = []
      requests.push(canViewBuyerUsers ? Users.List<IBuyerUser>(buyer.ID) : null)
      requests.push(canViewBuyerUserGroups ? UserGroups.List<IBuyerUserGroup>(buyer.ID) : null)
      requests.push(canViewBuyerCatalogs ? Catalogs.ListAssignments({buyerID: buyer.ID}) : null)

      return Promise.all(requests).then((responses) => {
        return {
          ...buyer,
          usersCount: canViewBuyerUsers && responses[0].Meta.TotalCount,
          userGroupsCount: canViewBuyerUserGroups && responses[1].Meta.TotalCount,
          catalogsCount: canViewBuyerCatalogs && responses[2].Meta.TotalCount
        }
      })
    })

    const enhancedBuyers = await Promise.all(enhancedBuyerRequests)
    return {Meta: buyersList.Meta, Items: enhancedBuyers}
  }

  const [actionBuyer, setActionBuyer] = useState<IBuyerListItem>()
  const deleteDisclosure = useDisclosure()

  const renderBuyerActionMenu = useCallback(
    (buyer: IBuyerListItem) => {
      return <BuyerActionMenu buyer={buyer} onOpen={() => setActionBuyer(buyer)} onDelete={deleteDisclosure.onOpen} />
    },
    [deleteDisclosure.onOpen]
  )

  const resolveBuyerDetailHref = (buyer: IBuyer) => {
    return `/buyers/${buyer.ID}`
  }

  return (
    <ListView<IBuyerListItem>
      service={buyerListCall}
      tableOptions={BuyerTableOptions}
      paramMap={BuyerParamMap}
      queryMap={BuyerQueryMap}
      filterMap={BuyerFilterMap}
      itemHrefResolver={resolveBuyerDetailHref}
      itemActions={renderBuyerActionMenu}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <BuyerListToolbar {...listViewChildProps} />
          </Box>
          {renderContent}
          <BuyerDeleteModal
            onComplete={listViewChildProps.removeItems}
            buyers={
              actionBuyer
                ? [actionBuyer]
                : items
                ? items.filter((buyer) => listViewChildProps.selected.includes(buyer.ID))
                : []
            }
            disclosure={deleteDisclosure}
          />
        </Container>
      )}
    </ListView>
  )
}

export default BuyerList
