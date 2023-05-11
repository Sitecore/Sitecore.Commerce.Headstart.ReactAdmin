import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import {Box, Container, Text, useDisclosure} from "@chakra-ui/react"
import {SupplierUserGroups} from "ordercloud-javascript-sdk"
import {FC, useCallback, useState} from "react"
import {ISupplierUserGroup} from "types/ordercloud/ISupplierUserGroup"
import SupplierUserGroupDeleteModal from "../modals/SupplierUserGroupDeleteModal"
import SupplierUserGroupActionMenu from "./SupplierUserGroupActionMenu"
import SupplierUserGroupListToolbar from "./SupplierUserGroupListToolBar"

interface ISupplierUserGroupList {
  supplierid: string
}

const SupplierUserGroupsParamMap = {
  d: "Direction",
  supplierid: "supplierID"
}

const SupplierUserGroupQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const SupplierIdColumn: DataTableColumn<ISupplierUserGroup> = {
  header: "Supplier UserGroup ID",
  accessor: "ID",
  cell: ({value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  )
}
const SupplierUserGroupNameColumn: DataTableColumn<ISupplierUserGroup> = {
  header: "USERS",
  accessor: "Name"
}

const SupplierUserGroupDescriptionColumn: DataTableColumn<ISupplierUserGroup> = {
  header: "DESCRIPTION",
  accessor: "Description"
}

const SupplierUserGroupTableOptions: ListViewTableOptions<ISupplierUserGroup> = {
  responsive: {
    base: [SupplierIdColumn, SupplierUserGroupNameColumn],
    md: [SupplierIdColumn, SupplierUserGroupNameColumn],
    lg: [SupplierIdColumn, SupplierUserGroupNameColumn, SupplierUserGroupDescriptionColumn],
    xl: [SupplierIdColumn, SupplierUserGroupNameColumn, SupplierUserGroupDescriptionColumn]
  }
}

const SupplierUserGroupList: FC<ISupplierUserGroupList> = ({supplierid}) => {
  const [actionSupplierUserGroup, setActionSupplierUserGroup] = useState<ISupplierUserGroup>()
  const deleteDisclosure = useDisclosure()

  const renderSupplierUserGroupActionMenu = useCallback(
    (usergroup: ISupplierUserGroup) => {
      return (
        <SupplierUserGroupActionMenu
          supplierid={supplierid}
          usergroup={usergroup}
          onOpen={() => setActionSupplierUserGroup(usergroup)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [supplierid, deleteDisclosure.onOpen]
  )

  const resolveSupplierUserGroupDetailHref = useCallback(
    (usergroup: ISupplierUserGroup) => {
      return `/suppliers/${supplierid}/usergroups/${usergroup.ID}`
    },
    [supplierid]
  )

  return (
    <ListView<ISupplierUserGroup>
      service={SupplierUserGroups.List}
      tableOptions={SupplierUserGroupTableOptions}
      paramMap={SupplierUserGroupsParamMap}
      queryMap={SupplierUserGroupQueryMap}
      itemHrefResolver={resolveSupplierUserGroupDetailHref}
      itemActions={renderSupplierUserGroupActionMenu}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <SupplierUserGroupListToolbar supplierid={supplierid} {...listViewChildProps} />
          </Box>
          {renderContent}
          <SupplierUserGroupDeleteModal
            onComplete={listViewChildProps.removeItems}
            supplierID={supplierid}
            usergroups={
              actionSupplierUserGroup
                ? [actionSupplierUserGroup]
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

export default SupplierUserGroupList
