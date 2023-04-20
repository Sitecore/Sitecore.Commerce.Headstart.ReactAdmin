import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import {Box, Button, Container, Tag, Text, useDisclosure} from "@chakra-ui/react"
import Link from "next/link"
import {RequiredDeep, Suppliers, SupplierUserGroups, SupplierUsers} from "ordercloud-javascript-sdk"
import {FC, useCallback, useState} from "react"
import {ISupplier} from "types/ordercloud/ISupplier"
import {ISupplierUser} from "types/ordercloud/ISupplierUser"
import {ISupplierUserGroup} from "types/ordercloud/ISupplierUserGroup"
import {dateHelper} from "utils"
import SupplierDeleteModal from "../modals/SupplierDeleteModal"
import SupplierActionMenu from "./SupplierActionMenu"
import SupplierListToolbar from "./SupplierListToolBar"

interface ISupplierListItem extends RequiredDeep<ISupplier> {
  userGroupsCount: number
  usersCount: number
}

const SupplierQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const SupplierFilterMap = {
  active: "Active"
}

const IdColumn: DataTableColumn<ISupplierListItem> = {
  header: "Supplier ID",
  accessor: "ID",
  cell: ({row, value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  )
}

const NameColumn: DataTableColumn<ISupplierListItem> = {
  header: "NAME",
  accessor: "Name",
  cell: ({row, value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  )
}

const StatusColumn: DataTableColumn<ISupplierListItem> = {
  header: "Status",
  accessor: "Active",
  width: "1%",
  cell: ({row, value}) => <Tag colorScheme={value ? "success" : "danger"}>{value ? "Active" : "Inactive"}</Tag>,
  sortable: true
}

const CreatedDateColumn: DataTableColumn<ISupplierListItem> = {
  header: "CREATED DATE",
  accessor: "DateCreated",
  cell: ({value}) => dateHelper.formatDate(value)
}

const UserGroupColumn: DataTableColumn<ISupplierListItem> = {
  header: "USER GROUPS",
  skipHref: true,
  cell: ({row}) => (
    <Link passHref href={`/suppliers/${row.original.ID}/usergroups`}>
      <Button as="a" variant="outline">
        User Groups ({row.original.userGroupsCount})
      </Button>
    </Link>
  )
}

const SupplierUsersColumn: DataTableColumn<ISupplierListItem> = {
  header: "USERS",
  skipHref: true,
  cell: ({row}) => (
    <Link passHref href={`/suppliers/${row.original.ID}/users`}>
      <Button as="a" variant="outline">
        Users ({row.original.usersCount})
      </Button>
    </Link>
  )
}

const SupplierTableOptions: ListViewTableOptions<ISupplierListItem> = {
  responsive: {
    base: [IdColumn, NameColumn],
    md: [IdColumn, NameColumn],
    lg: [IdColumn, NameColumn],
    xl: [IdColumn, NameColumn, StatusColumn, CreatedDateColumn, UserGroupColumn, SupplierUsersColumn]
  }
}

const supplierListCall = async (listOptions: any) => {
  const response = await Suppliers.List(listOptions)
  const queue = []
  const decoratedSupplierItems = []
  response.Items.forEach((supplier) => {
    queue.push(
      Promise.all([
        SupplierUserGroups.List<ISupplierUserGroup>(supplier.ID),
        SupplierUsers.List<ISupplierUser>(supplier.ID)
      ]).then((responses) => {
        const decoratedSupplier: ISupplierListItem = {
          ...supplier,
          userGroupsCount: responses[0].Meta.TotalCount,
          usersCount: responses[1].Meta.TotalCount
        }
        decoratedSupplierItems.push(decoratedSupplier)
      })
    )
  })
  await Promise.all(queue)
  return {Meta: response.Meta, Items: decoratedSupplierItems}
}

const SupplierList: FC = () => {
  const [actionSupplier, setActionSupplier] = useState<ISupplierListItem>()
  const deleteDisclosure = useDisclosure()

  const renderSupplierActionMenu = useCallback(
    (supplier: ISupplierListItem) => {
      return (
        <SupplierActionMenu
          supplier={supplier}
          onOpen={() => setActionSupplier(supplier)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [deleteDisclosure.onOpen]
  )

  const resolveSupplierDetailHref = (supplier: ISupplier) => {
    return `/suppliers/${supplier.ID}`
  }

  return (
    <ListView<ISupplierListItem>
      service={supplierListCall}
      tableOptions={SupplierTableOptions}
      queryMap={SupplierQueryMap}
      filterMap={SupplierFilterMap}
      itemHrefResolver={resolveSupplierDetailHref}
      itemActions={renderSupplierActionMenu}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <SupplierListToolbar {...listViewChildProps} />
          </Box>
          {renderContent}
          <SupplierDeleteModal
            onComplete={listViewChildProps.removeItems}
            suppliers={
              actionSupplier
                ? [actionSupplier]
                : items
                ? items.filter((supplier) => listViewChildProps.selected.includes(supplier.ID))
                : []
            }
            disclosure={deleteDisclosure}
          />
        </Container>
      )}
    </ListView>
  )
}

export default SupplierList
