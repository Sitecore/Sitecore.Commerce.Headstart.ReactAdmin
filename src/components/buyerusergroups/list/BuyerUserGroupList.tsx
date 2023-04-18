import {Box, Button, ButtonGroup, Container, Icon, Text, useDisclosure} from "@chakra-ui/react"
import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import Link from "next/link"
import {FC, useCallback, useMemo, useState} from "react"
import {MdCheck} from "react-icons/md"
import {IoMdClose} from "react-icons/io"
import {dateHelper} from "utils"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"
import BuyerUserGroupActionMenu from "./BuyerUserGroupActionMenu"
import {UserGroups} from "ordercloud-javascript-sdk"
import BuyerUserGroupListToolbar from "./BuyerUserGroupListToolBar"
import BuyerUserGroupDeleteModal from "../modals/BuyerUserGroupDeleteModal"

interface IBuyerUserGroupList {
  buyerid: string
}

const paramMap = {
  d: "Direction",
  buyerid: "BuyerID"
}

const BuyerUserGroupQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const BuyerUserGroupFilterMap = {
  active: "Active"
}

const UserGroupNameColumn: DataTableColumn<IBuyerUserGroup> = {
  header: "USERS",
  accessor: "Name"
}

const UserGroupDescriptionColumn: DataTableColumn<IBuyerUserGroup> = {
  header: "DESCRIPTION",
  accessor: "Description"
}

const BuyerUserGroupList: FC<IBuyerUserGroupList> = ({buyerid}) => {
  const [actionBuyerUserGroup, setActionBuyerUserGroup] = useState<IBuyerUserGroup>()
  const deleteDisclosure = useDisclosure()

  const renderBuyerUserGroupActionMenu = useCallback(
    (usergroup: IBuyerUserGroup) => {
      return (
        <BuyerUserGroupActionMenu
          usergroup={usergroup}
          onOpen={() => setActionBuyerUserGroup(usergroup)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [deleteDisclosure.onOpen]
  )

  const IdColumn: DataTableColumn<IBuyerUserGroup> = useMemo(() => {
    return {
      header: "BuyerUserGroup ID",
      accessor: "ID",
      cell: ({row, value}) => (
        <Link href={`/buyers/${buyerid}/usergroups/${row.original.ID}`}>
          <Text as="a" noOfLines={2} title={value}>
            {value}
          </Text>
        </Link>
      )
    }
    }, [buyerid])

  const BuyerUserGroupTableOptions: ListViewTableOptions<IBuyerUserGroup> = useMemo(() => {
    return {
    responsive: {
      base: [IdColumn, UserGroupNameColumn],
      md: [IdColumn, UserGroupNameColumn],
      lg: [IdColumn, UserGroupNameColumn, UserGroupDescriptionColumn],
      xl: [IdColumn, UserGroupNameColumn, UserGroupDescriptionColumn]
    }
  }
  }, [IdColumn])

  return (
    <ListView<IBuyerUserGroup>
      service={UserGroups.List}
      tableOptions={BuyerUserGroupTableOptions}
      paramMap={paramMap}
      queryMap={BuyerUserGroupQueryMap}
      itemActions={renderBuyerUserGroupActionMenu}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%">
          <Box>
            <BuyerUserGroupListToolbar buyerid={buyerid} {...listViewChildProps} />
          </Box>
          {renderContent}
          <BuyerUserGroupDeleteModal
            onComplete={listViewChildProps.removeItems}
            buyerID={buyerid}
            usergroups={
              actionBuyerUserGroup
                ? [actionBuyerUserGroup]
                : items
                ? items.filter((usergroup) => listViewChildProps.selected.includes(usergroup.ID))
                : []
            }
            disclosure={deleteDisclosure}
          />
        </Container>
      )}
    </ListView>
  )
}

export default BuyerUserGroupList
