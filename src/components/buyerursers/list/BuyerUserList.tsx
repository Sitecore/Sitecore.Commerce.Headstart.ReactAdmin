import {Box, Button, ButtonGroup, Container, Icon, Tag, Text, useDisclosure} from "@chakra-ui/react"
import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import Link from "next/link"
import {FC, useCallback, useMemo, useState} from "react"
import {MdCheck} from "react-icons/md"
import {IoMdClose} from "react-icons/io"
import {dateHelper} from "utils"
import {IBuyerUser} from "types/ordercloud/IBuyerUser"
import BuyerUserActionMenu from "./BuyerUserActionMenu"
import BuyerUserListToolbar from "./BuyerUserListToolBar"
import BuyerUsersDeleteModal from "../modals/BuyerUserDeleteModal"
import { Users } from "ordercloud-javascript-sdk"

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

const BuyerUserLastNameColumn: DataTableColumn<IBuyerUser> = {
  header: "LastName",
  accessor: "LastName"
}

const BuyerUserCompanyIDColumn: DataTableColumn<IBuyerUser> = {
    header: "Company ID",
    accessor: "CompanyID"
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

  const firstNameColumn: DataTableColumn<IBuyerUser> = useMemo(() => {
    return {
      header: "FirstName",
      accessor: "FirstName",
      cell: ({row, value}) => (
        <Link href={`/buyers/${buyerid}/users/${row.original.ID}`}>
          <Text as="a" noOfLines={2} title={value}>
            {value}
          </Text>
        </Link>
      )
    }
    }, [buyerid])

  const BuyerUsersTableOptions: ListViewTableOptions<IBuyerUser> = useMemo(() => {
    return {
    responsive: {
      base: [firstNameColumn, BuyerUserLastNameColumn],
      md: [firstNameColumn, BuyerUserLastNameColumn],
      lg: [firstNameColumn, BuyerUserLastNameColumn, BuyerUserUsernameColumn, BuyerUserActiveColumn],
      xl: [firstNameColumn, BuyerUserLastNameColumn, BuyerUserCompanyIDColumn, BuyerUserUsernameColumn, BuyerUserEmailColumn, BuyerPhoneColumn, BuyerUserActiveColumn]
    }
  }
  }, [firstNameColumn])

  return (
    <ListView<IBuyerUser>
      service={Users.List}
      tableOptions={BuyerUsersTableOptions}
      paramMap={paramMap}
      queryMap={BuyerUsersQueryMap}
      filterMap={BuyerUsersFilterMap}
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
