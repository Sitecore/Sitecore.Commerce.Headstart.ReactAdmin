import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import {Box, Container, Tag, Text, useDisclosure} from "@chakra-ui/react"
import {Users} from "ordercloud-javascript-sdk"
import {FC, useCallback, useState} from "react"
import {IBuyerUser} from "types/ordercloud/IBuyerUser"
import BuyerUsersDeleteModal from "../modals/BuyerUserDeleteModal"
import BuyerUserActionMenu from "./BuyerUserActionMenu"
import BuyerUserListToolbar from "./BuyerUserListToolBar"

export const BuyerUserColorSchemeMap = {
  "": "gray",
  true: "success",
  false: "danger"
}

interface IBuyerUserList {
  buyerid: string
}

const paramMap = {
  d: "Direction",
  buyerid: "BuyerID"
}

const BuyerUsersQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const BuyerUsersFilterMap = {
  active: "Active"
}

const firstNameColumn: DataTableColumn<IBuyerUser> = {
  header: "FirstName",
  accessor: "FirstName"
}

const BuyerUserLastNameColumn: DataTableColumn<IBuyerUser> = {
  header: "LastName",
  accessor: "LastName"
}

const BuyerUserUsernameColumn: DataTableColumn<IBuyerUser> = {
  header: "Username",
  accessor: "Username"
}

const BuyerUserEmailColumn: DataTableColumn<IBuyerUser> = {
  header: "Email",
  accessor: "Email"
}

const BuyerPhoneColumn: DataTableColumn<IBuyerUser> = {
  header: "Phone",
  accessor: "Phone"
}

const BuyerUserActiveColumn: DataTableColumn<IBuyerUser> = {
  header: "Active",
  accessor: "Active",
  cell: ({row, value}) => (
    <Tag as="a" colorScheme={BuyerUserColorSchemeMap[value] || "default"}>
      <Text>{row.original.Active ? "Active" : "Non active"}</Text>
    </Tag>
  )
}

const BuyerUsersTableOptions: ListViewTableOptions<IBuyerUser> = {
  responsive: {
    base: [firstNameColumn, BuyerUserLastNameColumn],
    md: [firstNameColumn, BuyerUserLastNameColumn],
    lg: [firstNameColumn, BuyerUserLastNameColumn, BuyerUserUsernameColumn, BuyerUserActiveColumn],
    xl: [
      firstNameColumn,
      BuyerUserLastNameColumn,
      BuyerUserUsernameColumn,
      BuyerUserEmailColumn,
      BuyerPhoneColumn,
      BuyerUserActiveColumn
    ]
  }
}

const BuyerUserList: FC<IBuyerUserList> = ({buyerid}) => {
  const [actionBuyerUsers, setActionBuyerUsers] = useState<IBuyerUser>()
  const deleteDisclosure = useDisclosure()

  const renderBuyerUsersActionMenu = useCallback(
    (buyeruser: IBuyerUser) => {
      return (
        <BuyerUserActionMenu
          buyerid={buyerid}
          buyeruser={buyeruser}
          onOpen={() => setActionBuyerUsers(buyeruser)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [buyerid, deleteDisclosure.onOpen]
  )

  const resolveBuyerUserDetailHref = useCallback(
    (user: IBuyerUser) => {
      return `/buyers/${buyerid}/users/${user.ID}`
    },
    [buyerid]
  )

  return (
    <ListView<IBuyerUser>
      service={Users.List}
      tableOptions={BuyerUsersTableOptions}
      paramMap={paramMap}
      queryMap={BuyerUsersQueryMap}
      filterMap={BuyerUsersFilterMap}
      itemHrefResolver={resolveBuyerUserDetailHref}
      itemActions={renderBuyerUsersActionMenu}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <BuyerUserListToolbar buyerid={buyerid} {...listViewChildProps} />
          </Box>
          {renderContent}
          <BuyerUsersDeleteModal
            onComplete={listViewChildProps.removeItems}
            buyerID={buyerid}
            buyerusers={
              actionBuyerUsers
                ? [actionBuyerUsers]
                : items
                ? items.filter((buyeruser) => listViewChildProps.selected.includes(buyeruser.ID))
                : []
            }
            disclosure={deleteDisclosure}
          />
        </Container>
      )}
    </ListView>
  )
}

export default BuyerUserList
