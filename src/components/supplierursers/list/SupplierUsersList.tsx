import {Box, Button, ButtonGroup, Container, Icon, Tag, Text, useDisclosure} from "@chakra-ui/react"
import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import Link from "next/link"
import {FC, useCallback, useMemo, useState} from "react"
import {MdCheck} from "react-icons/md"
import {IoMdClose} from "react-icons/io"
import {dateHelper} from "utils"
import {ISupplierUser} from "types/ordercloud/ISupplierUser"
import SupplierUsersActionMenu from "./SupplierUsersActionMenu"
import SupplierUsersListToolbar from "./SupplierUsersListToolBar"
import SupplierUsersDeleteModal from "../modals/SupplierUsersDeleteModal"
import { SupplierUsers } from "ordercloud-javascript-sdk"

export const SupplierUserColorSchemeMap = {
    "": "gray",
    true: "success",
    false: "danger"
  }

interface ISupplierUserList {
  supplierid: string
}

const paramMap = {
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

const SupplierUsersList: FC<ISupplierUserList> = ({supplierid}) => {
  const [actionSupplierUsers, setActionSupplierUsers] = useState<ISupplierUser>()
  const deleteDisclosure = useDisclosure()

  const renderSupplierUsersActionMenu = useCallback(
    (supplieruser: ISupplierUser) => {
      return (
        <SupplierUsersActionMenu
          supplierid={supplierid}
          supplieruser={supplieruser}
          onOpen={() => setActionSupplierUsers(supplieruser)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [supplierid, deleteDisclosure.onOpen]
  )

  const SupplierUserFirstNameColumn: DataTableColumn<ISupplierUser> = useMemo(() => {
    return {
      header: "FirstName",
      accessor: "FirstName",
      cell: ({row, value}) => (
        <Link href={`/suppliers/${supplierid}/users/${row.original.ID}`}>
          <Text as="a" noOfLines={2} title={value}>
            {value}
          </Text>
        </Link>
      )
    }
    }, [supplierid])

  const SupplierUsersTableOptions: ListViewTableOptions<ISupplierUser> = useMemo(() => {
    return {
    responsive: {
      base: [SupplierUserFirstNameColumn, SupplierUserLastNameColumn],
      md: [SupplierUserFirstNameColumn, SupplierUserLastNameColumn],
      lg: [SupplierUserFirstNameColumn, SupplierUserLastNameColumn, SupplierUserUsernameColumn, SupplierUserActiveColumn],
      xl: [SupplierUserFirstNameColumn, SupplierUserLastNameColumn, SupplierUserCompanyIDColumn, SupplierUserUsernameColumn, SupplierUserEmailColumn, SupplierUserPhoneColumn, SupplierUserActiveColumn]
    }
  }
  }, [SupplierUserFirstNameColumn])

  return (
    <ListView<ISupplierUser>
      service={SupplierUsers.List}
      tableOptions={SupplierUsersTableOptions}
      paramMap={paramMap}
      queryMap={SupplierUsersQueryMap}
      filterMap={SupplierUsersFilterMap}
      itemActions={renderSupplierUsersActionMenu}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <SupplierUsersListToolbar supplierid={supplierid} {...listViewChildProps} />
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

export default SupplierUsersList
