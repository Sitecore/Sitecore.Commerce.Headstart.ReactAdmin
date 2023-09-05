import {Box, Container, Text, useDisclosure} from "@chakra-ui/react"
import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import {FC, useCallback, useState} from "react"
import {IAdminUserGroup} from "types/ordercloud/IAdminUserGroup"
import AdminUserGroupActionMenu from "./AdminUserGroupActionMenu"
import {AdminUserGroups} from "ordercloud-javascript-sdk"
import AdminUserGroupListToolbar from "./AdminUserGroupListToolbar"
import AdminUserGroupDeleteModal from "../modals/AdminUserGroupDeleteModal"

interface IAdminUserGroupList {}

const paramMap = {}

const AdminUserGroupQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const AdminUserGroupFilterMap = {
  active: "Active"
}

const IdColumn: DataTableColumn<IAdminUserGroup> = {
  header: "ID",
  accessor: "ID",
  cell: ({value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  )
}

const UserGroupNameColumn: DataTableColumn<IAdminUserGroup> = {
  header: "USERS",
  accessor: "Name"
}

const UserGroupDescriptionColumn: DataTableColumn<IAdminUserGroup> = {
  header: "DESCRIPTION",
  accessor: "Description"
}

const AdminUserGroupTableOptions: ListViewTableOptions<IAdminUserGroup> = {
  responsive: {
    base: [IdColumn, UserGroupNameColumn],
    md: [IdColumn, UserGroupNameColumn],
    lg: [IdColumn, UserGroupNameColumn, UserGroupDescriptionColumn],
    xl: [IdColumn, UserGroupNameColumn, UserGroupDescriptionColumn]
  }
}

const AdminUserGroupList: FC<IAdminUserGroupList> = ({}) => {
  const [actionAdminUserGroup, setActionAdminUserGroup] = useState<IAdminUserGroup>()
  const deleteDisclosure = useDisclosure()

  const renderAdminUserGroupActionMenu = useCallback(
    (usergroup: IAdminUserGroup) => {
      return (
        <AdminUserGroupActionMenu
          usergroup={usergroup}
          onOpen={() => setActionAdminUserGroup(usergroup)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [deleteDisclosure.onOpen]
  )

  const resolveAdminUserGroupDetailHref = useCallback((ug: IAdminUserGroup) => {
    return `/settings/adminusergroups/${ug.ID}`
  }, [])

  return (
    <ListView<IAdminUserGroup>
      service={AdminUserGroups.List}
      tableOptions={AdminUserGroupTableOptions}
      paramMap={paramMap}
      queryMap={AdminUserGroupQueryMap}
      filterMap={AdminUserGroupFilterMap}
      itemHrefResolver={resolveAdminUserGroupDetailHref}
      itemActions={renderAdminUserGroupActionMenu}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <AdminUserGroupListToolbar {...listViewChildProps} />
          </Box>
          {renderContent}
          <AdminUserGroupDeleteModal
            onComplete={listViewChildProps.removeItems}
            usergroups={
              actionAdminUserGroup
                ? [actionAdminUserGroup]
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

export default AdminUserGroupList
