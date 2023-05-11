import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import {Box, Container, Tag, Text, useDisclosure} from "@chakra-ui/react"
import Link from "next/link"
import {SupplierUsers} from "ordercloud-javascript-sdk"
import {FC, useCallback, useMemo, useState} from "react"
import {ISupplierUser} from "types/ordercloud/ISupplierUser"
import SupplierUsersDeleteModal from "../modals/SupplierUserDeleteModal"
import SupplierUserActionMenu from "./SupplierUserActionMenu"
import SupplierUserListToolbar from "./SupplierUserListToolBar"

export const SupplierUserColorSchemeMap = {
  "": "gray",
  true: "success",
  false: "danger"
}

interface ISupplierUserList {
  supplierid: string
}

const SupplierUserListParamMap = {
  d: "Direction",
  supplierid: "SupplierID"
}

const SupplierUsersQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const SupplierUsersFilterMap = {
  active: "Active"
}

const SupplierUserFirstNameColumn: DataTableColumn<ISupplierUser> = {
  header: "FirstName",
  accessor: "FirstName",
  cell: ({value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  )
}

const SupplierUserLastNameColumn: DataTableColumn<ISupplierUser> = {
  header: "LastName",
  accessor: "LastName"
}

const SupplierUserCompanyIDColumn: DataTableColumn<ISupplierUser> = {
  header: "Company ID",
  accessor: "CompanyID"
}

const SupplierUserUsernameColumn: DataTableColumn<ISupplierUser> = {
  header: "Username",
  accessor: "Username"
}

const SupplierUserEmailColumn: DataTableColumn<ISupplierUser> = {
  header: "Email",
  accessor: "Email"
}

const SupplierUserPhoneColumn: DataTableColumn<ISupplierUser> = {
  header: "Phone",
  accessor: "Phone"
}

const SupplierUserActiveColumn: DataTableColumn<ISupplierUser> = {
  header: "Active",
  accessor: "Active",
  cell: ({row, value}) => (
    <Tag as="a" colorScheme={SupplierUserColorSchemeMap[value] || "default"}>
      <Text>{row.original.Active ? "Active" : "Non active"}</Text>
    </Tag>
  )
}

const SupplierUsersTableOptions: ListViewTableOptions<ISupplierUser> = {
  responsive: {
    base: [SupplierUserFirstNameColumn, SupplierUserLastNameColumn],
    md: [SupplierUserFirstNameColumn, SupplierUserLastNameColumn],
    lg: [SupplierUserFirstNameColumn, SupplierUserLastNameColumn, SupplierUserUsernameColumn, SupplierUserActiveColumn],
    xl: [
      SupplierUserFirstNameColumn,
      SupplierUserLastNameColumn,
      SupplierUserCompanyIDColumn,
      SupplierUserUsernameColumn,
      SupplierUserEmailColumn,
      SupplierUserPhoneColumn,
      SupplierUserActiveColumn
    ]
  }
}

const SupplierUserList: FC<ISupplierUserList> = ({supplierid}) => {
  const [actionSupplierUsers, setActionSupplierUsers] = useState<ISupplierUser>()
  const deleteDisclosure = useDisclosure()

  const renderSupplierUsersActionMenu = useCallback(
    (supplieruser: ISupplierUser) => {
      return (
        <SupplierUserActionMenu
          supplierid={supplierid}
          supplieruser={supplieruser}
          onOpen={() => setActionSupplierUsers(supplieruser)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [supplierid, deleteDisclosure.onOpen]
  )

  const resolveSupplierUserDetailHref = useCallback(
    (user: ISupplierUser) => {
      return `/suppliers/${supplierid}/users/${user.ID}`
    },
    [supplierid]
  )

  return (
    <ListView<ISupplierUser>
      service={SupplierUsers.List}
      tableOptions={SupplierUsersTableOptions}
      paramMap={SupplierUserListParamMap}
      queryMap={SupplierUsersQueryMap}
      filterMap={SupplierUsersFilterMap}
      itemHrefResolver={resolveSupplierUserDetailHref}
      itemActions={renderSupplierUsersActionMenu}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <SupplierUserListToolbar supplierid={supplierid} {...listViewChildProps} />
          </Box>
          {renderContent}
          <SupplierUsersDeleteModal
            onComplete={listViewChildProps.removeItems}
            supplierID={supplierid}
            supplierusers={
              actionSupplierUsers
                ? [actionSupplierUsers]
                : items
                ? items.filter((supplieruser) => listViewChildProps.selected.includes(supplieruser.ID))
                : []
            }
            disclosure={deleteDisclosure}
          />
        </Container>
      )}
    </ListView>
  )
}

export default SupplierUserList
