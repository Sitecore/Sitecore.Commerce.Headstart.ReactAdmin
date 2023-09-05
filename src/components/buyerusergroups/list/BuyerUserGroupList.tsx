import {Box, Container, Text, useDisclosure} from "@chakra-ui/react"
import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import {FC, useCallback, useState} from "react"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"
import BuyerUserGroupActionMenu from "./BuyerUserGroupActionMenu"
import {UserGroups} from "ordercloud-javascript-sdk"
import BuyerUserGroupListToolbar from "./BuyerUserGroupListToolBar"
import BuyerUserGroupDeleteModal from "../modals/BuyerUserGroupDeleteModal"

interface IBuyerUserGroupList {
  buyerid: string
}

const paramMap = {
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

const IdColumn: DataTableColumn<IBuyerUserGroup> = {
  header: "BuyerUserGroup ID",
  accessor: "ID",
  cell: ({value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  )
}

const UserGroupNameColumn: DataTableColumn<IBuyerUserGroup> = {
  header: "USERS",
  accessor: "Name"
}

const UserGroupDescriptionColumn: DataTableColumn<IBuyerUserGroup> = {
  header: "DESCRIPTION",
  accessor: "Description"
}

const BuyerUserGroupTableOptions: ListViewTableOptions<IBuyerUserGroup> = {
  responsive: {
    base: [IdColumn, UserGroupNameColumn],
    md: [IdColumn, UserGroupNameColumn],
    lg: [IdColumn, UserGroupNameColumn, UserGroupDescriptionColumn],
    xl: [IdColumn, UserGroupNameColumn, UserGroupDescriptionColumn]
  }
}

const BuyerUserGroupList: FC<IBuyerUserGroupList> = ({buyerid}) => {
  const [actionBuyerUserGroup, setActionBuyerUserGroup] = useState<IBuyerUserGroup>()
  const deleteDisclosure = useDisclosure()

  const renderBuyerUserGroupActionMenu = useCallback(
    (usergroup: IBuyerUserGroup) => {
      return (
        <BuyerUserGroupActionMenu
          buyerid={buyerid}
          usergroup={usergroup}
          onOpen={() => setActionBuyerUserGroup(usergroup)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [deleteDisclosure.onOpen, buyerid]
  )

  const resolveBuyerUserGroupDetailHref = useCallback(
    (ug: IBuyerUserGroup) => {
      return `/buyers/${buyerid}/usergroups/${ug.ID}`
    },
    [buyerid]
  )

  return (
    <ListView<IBuyerUserGroup>
      service={UserGroups.List}
      tableOptions={BuyerUserGroupTableOptions}
      paramMap={paramMap}
      queryMap={BuyerUserGroupQueryMap}
      filterMap={BuyerUserGroupFilterMap}
      itemHrefResolver={resolveBuyerUserGroupDetailHref}
      itemActions={renderBuyerUserGroupActionMenu}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
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
