import {Box, Button, ButtonGroup, Container, Icon, Text, useDisclosure} from "@chakra-ui/react"
import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import Link from "next/link"
import {FC, useCallback, useMemo, useState} from "react"
import {MdCheck} from "react-icons/md"
import {IoMdClose} from "react-icons/io"
import {dateHelper} from "utils"
import {ISupplierUserGroup} from "types/ordercloud/ISupplierUserGroup"
import SupplierUserGroupActionMenu from "./SupplierUserGroupActionMenu"
import {SupplierUserGroups} from "ordercloud-javascript-sdk"
import SupplierUserGroupListToolbar from "./SupplierUserGroupListToolBar"
import SupplierUserGroupDeleteModal from "../modals/SupplierUserGroupDeleteModal"

interface ISupplierUserGroupList {
  supplierid: string
}

const paramMap = {
  d: "Direction",
  supplierid: "supplierID"
}

const SupplierUserGroupQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const SupplierUserGroupNameColumn: DataTableColumn<ISupplierUserGroup> = {
  header: "USERS",
  accessor: "Name"
}

const SupplierUserGroupDescriptionColumn: DataTableColumn<ISupplierUserGroup> = {
  header: "DESCRIPTION",
  accessor: "Description"
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
    [deleteDisclosure.onOpen]
  )

  const SupplierIdColumn: DataTableColumn<ISupplierUserGroup> = useMemo(() => {
    return {
      header: "Supplier UserGroup ID",
      accessor: "ID",
      cell: ({row, value}) => (
        <Link href={`/suppliers/${supplierid}/usergroups/${row.original.ID}`}>
          <Text as="a" noOfLines={2} title={value}>
            {value}
          </Text>
        </Link>
      )
    }
    }, [supplierid])

  const SupplierUserGroupTableOptions: ListViewTableOptions<ISupplierUserGroup> = useMemo(() => {
    return {
    responsive: {
      base: [SupplierIdColumn, SupplierUserGroupNameColumn],
      md: [SupplierIdColumn, SupplierUserGroupNameColumn],
      lg: [SupplierIdColumn, SupplierUserGroupNameColumn, SupplierUserGroupDescriptionColumn],
      xl: [SupplierIdColumn, SupplierUserGroupNameColumn, SupplierUserGroupDescriptionColumn]
    }
  }
  }, [SupplierIdColumn])

  return (
    <ListView<ISupplierUserGroup>
      service={SupplierUserGroups.List}
      tableOptions={SupplierUserGroupTableOptions}
      paramMap={paramMap}
      queryMap={SupplierUserGroupQueryMap}
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
