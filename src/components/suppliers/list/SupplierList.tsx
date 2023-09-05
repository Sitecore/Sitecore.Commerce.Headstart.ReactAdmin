import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import {Box, Button, Container, Tag, Text, useDisclosure} from "@chakra-ui/react"
import Link from "next/link"
import {RequiredDeep, SupplierAddresses, Suppliers, SupplierUserGroups, SupplierUsers} from "ordercloud-javascript-sdk"
import {FC, useCallback, useState} from "react"
import {ISupplier} from "types/ordercloud/ISupplier"
import {ISupplierUser} from "types/ordercloud/ISupplierUser"
import {ISupplierUserGroup} from "types/ordercloud/ISupplierUserGroup"
import {dateHelper} from "utils"
import SupplierDeleteModal from "../modals/SupplierDeleteModal"
import SupplierActionMenu from "./SupplierActionMenu"
import SupplierListToolbar from "./SupplierListToolBar"
import {ISupplierAddress} from "types/ordercloud/ISupplierAddress"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"

interface ISupplierListItem extends RequiredDeep<ISupplier> {
  userGroupsCount: number
  usersCount: number
  addressCount: number
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

const SupplierUserGroupColumn: DataTableColumn<ISupplierListItem> = {
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

const SupplierAddressColumn: DataTableColumn<ISupplierListItem> = {
  header: "ADDRESSES",
  skipHref: true,
  cell: ({row}) => (
    <Link passHref href={`/suppliers/${row.original.ID}/addresses`}>
      <Button as="a" variant="outline">
        Addresses ({row.original.addressCount})
      </Button>
    </Link>
  )
}

const SupplierTableOptions: ListViewTableOptions<ISupplierListItem> = {
  responsive: {
    base: [IdColumn, NameColumn],
    md: [IdColumn, NameColumn],
    lg: [IdColumn, NameColumn],
    xl: [IdColumn, NameColumn, StatusColumn, CreatedDateColumn]
  }
}

const SupplierList: FC = () => {
  const [actionSupplier, setActionSupplier] = useState<ISupplierListItem>()
  const deleteDisclosure = useDisclosure()

  const canViewSupplierUsers = useHasAccess([appPermissions.SupplierUserViewer, appPermissions.SupplierUserManager])
  const canViewSupplierUserGroups = useHasAccess([
    appPermissions.SupplierUserGroupViewer,
    appPermissions.SupplierUserGroupManager
  ])
  const canViewSupplierAddresses = useHasAccess([
    appPermissions.SupplierAddressViewer,
    appPermissions.SupplierAddressManager
  ])

  if (canViewSupplierUsers && !SupplierTableOptions.responsive.xl.map((c) => c.header).includes("USERS")) {
    SupplierTableOptions.responsive.xl.push(SupplierUsersColumn)
  }
  if (canViewSupplierUserGroups && !SupplierTableOptions.responsive.xl.map((c) => c.header).includes("USER GROUPS")) {
    SupplierTableOptions.responsive.xl.push(SupplierUserGroupColumn)
  }
  if (canViewSupplierAddresses && !SupplierTableOptions.responsive.xl.map((c) => c.header).includes("ADDRESSES")) {
    SupplierTableOptions.responsive.xl.push(SupplierAddressColumn)
  }

  const supplierListCall = async (listOptions: any) => {
    const supplierList = await Suppliers.List(listOptions)
    const enhancedSupplierRequests = supplierList.Items.map(async (supplier) => {
      const requests = []
      requests.push(canViewSupplierUsers ? SupplierUsers.List<ISupplierUser>(supplier.ID) : null)
      requests.push(canViewSupplierUserGroups ? SupplierUserGroups.List<ISupplierUserGroup>(supplier.ID) : null)
      requests.push(canViewSupplierAddresses ? SupplierAddresses.List<ISupplierAddress>(supplier.ID) : null)

      return Promise.all(requests).then((responses) => {
        return {
          ...supplier,
          usersCount: canViewSupplierUsers && responses[0].Meta.TotalCount,
          userGroupsCount: canViewSupplierUserGroups && responses[1].Meta.TotalCount,
          addressCount: canViewSupplierAddresses && responses[2].Meta.TotalCount
        }
      })
    })

    const enhancedSuppliers = await Promise.all(enhancedSupplierRequests)
    return {Meta: supplierList.Meta, Items: enhancedSuppliers}
  }

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
