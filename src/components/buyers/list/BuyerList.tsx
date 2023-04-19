import {Badge, Box, Button, ButtonGroup, Container, Icon, Tag, Text, useDisclosure} from "@chakra-ui/react"
import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import Link from "next/link"
import {Buyers, Catalogs, RequiredDeep, UserGroups, Users} from "ordercloud-javascript-sdk"
import {FC, useCallback, useState} from "react"
import {IBuyer} from "types/ordercloud/IBuyer"
import {MdCheck} from "react-icons/md"
import {IoMdClose} from "react-icons/io"
import {dateHelper} from "utils"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"
import {IBuyerUser} from "types/ordercloud/IBuyerUser"
import BuyerListToolbar from "./BuyerListToolBar"
import BuyerActionMenu from "./BuyerActionMenu"
import BuyerDeleteModal from "../modals/BuyerDeleteModal"

interface IBuyerListItem extends RequiredDeep<IBuyer> {
  userGroupsCount: number
  usersCount: number
  catalogsCount: number
}

const buyerListCall = async (listOptions: any) => {
  const response = await Buyers.List(listOptions)
  const queue = []
  const decoratedBuyerItems = []
  response.Items.forEach((buyer) => {
    queue.push(
      Promise.all([
        UserGroups.List<IBuyerUserGroup>(buyer.ID),
        Users.List<IBuyerUser>(buyer.ID),
        Catalogs.ListAssignments({buyerID: buyer.ID})
      ]).then((responses) => {
        const decoratedBuyer: IBuyerListItem = {
          ...buyer,
          userGroupsCount: responses[0].Meta.TotalCount,
          usersCount: responses[1].Meta.TotalCount,
          catalogsCount: responses[2].Meta.TotalCount
        }
        decoratedBuyerItems.push(decoratedBuyer)
      })
    )
  })
  await Promise.all(queue)
  return {Meta: response.Meta, Items: decoratedBuyerItems}
}

const BuyerList: FC = () => {
  const [actionBuyer, setActionBuyer] = useState<IBuyerListItem>()
  const deleteDisclosure = useDisclosure()

  const renderBuyerActionMenu = useCallback(
    (buyer: IBuyerListItem) => {
      return <BuyerActionMenu buyer={buyer} onOpen={() => setActionBuyer(buyer)} onDelete={deleteDisclosure.onOpen} />
    },
    [deleteDisclosure.onOpen]
  )
  const paramMap = {
    d: "Direction"
  }

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
      <Link passHref href={"/buyers/" + row.original.ID}>
        <Text as="a" noOfLines={2} title={value}>
          {value}
        </Text>
      </Link>
    )
  }

  const NameColumn: DataTableColumn<IBuyerListItem> = {
    header: "NAME",
    accessor: "Name",
    cell: ({row, value}) => (
      <Link passHref href={"/buyers/" + row.original.ID}>
        <Text as="a" noOfLines={2} title={value}>
          {value}
        </Text>
      </Link>
    )
  }

  const DefaultCatalogIDColumn: DataTableColumn<IBuyer> = {
    header: "DEFAULT CATALOG ID",
    accessor: "DefaultCatalogID"
  }

  const StatusColumn: DataTableColumn<IBuyerListItem> = {
    header: "STATUS",
    accessor: "Active",
    cell: ({row}) => (
      <>
        <Tag colorScheme={row.original.Active === true ? "green" : "red"}>
          {row.original.Active ? "Active" : "Inactive"}
        </Tag>
        {/* <Badge variant="subtle" colorScheme={row.original.Active === true ? "green" : "red"}>
          {row.original.Active ? "Active" : "Inactive"}
        </Badge> */}
      </>
    )
  }

  const CreatedDateColumn: DataTableColumn<IBuyerListItem> = {
    header: "CREATED DATE",
    accessor: "DateCreated",
    cell: ({value}) => dateHelper.formatDate(value)
  }

  const UserGroupColumn: DataTableColumn<IBuyerListItem> = {
    header: "USER GROUPS",
    cell: ({row}) => (
      <Link passHref href={`/buyers/${row.original.ID}/usergroups`}>
        <Button variant="outline">User Groups ({row.original.userGroupsCount})</Button>
      </Link>
    )
  }

  const BuyerUsersColumn: DataTableColumn<IBuyerListItem> = {
    header: "USERS",
    cell: ({row}) => (
      <Link passHref href={`/buyers/${row.original.ID}/users`}>
        <Button variant="outline">Users ({row.original.usersCount})</Button>
      </Link>
    )
  }

  const CatalogColumn: DataTableColumn<IBuyerListItem> = {
    header: "CATALOGS",
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
      xl: [
        IdColumn,
        NameColumn,
        DefaultCatalogIDColumn,
        StatusColumn,
        CreatedDateColumn,
        UserGroupColumn,
        BuyerUsersColumn,
        CatalogColumn
      ]
    }
  }

  return (
    <ListView<IBuyerListItem>
      service={buyerListCall}
      tableOptions={BuyerTableOptions}
      paramMap={paramMap}
      queryMap={BuyerQueryMap}
      filterMap={BuyerFilterMap}
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
