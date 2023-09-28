import {Box, Container, Text, useDisclosure} from "@chakra-ui/react"
import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import Link from "next/link"
import {SecurityProfiles, SecurityProfile} from "ordercloud-javascript-sdk"
import {FC, useCallback, useState} from "react"
import SecurityProfileListToolbar from "./SecurityProfileListToolbar"
import SecurityProfileActionMenu from "./SecurityProfileActionMenu"
import SecurityProfileDeleteModal from "../modals/SecurityProfileDeleteModal"
import {isAllowedAccess} from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"

export const SecurityProfileColorSchemeMap = {
  "": "gray",
  true: "success",
  false: "danger"
}

const SecurityProfileParamMap = {}

const SecurityProfileQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const SecurityProfileFilterMap = {
  active: "Active"
}

const IdColumn: DataTableColumn<SecurityProfile> = {
  header: "ID",
  accessor: "ID",
  cell: ({row, value}) => (
    <Link passHref href={"/settings/securityprofiles/" + row.original.ID}>
      <Text as="a" noOfLines={2} title={value}>
        {value}
      </Text>
    </Link>
  )
}

const NumberFeaturesColumn: DataTableColumn<SecurityProfile> = {
  header: "# Admin Features",
  accessor: "Roles",
  cell: ({row}) => {
    const roles = row.original.Roles
    const customRoles = row.original.CustomRoles
    const allRoles = [...roles, ...customRoles]
    const features = Object.values(appPermissions).filter((permission) => isAllowedAccess(allRoles, permission, true))
    return <Text>{features.length}</Text>
  }
}

const NumberRolesColumn: DataTableColumn<SecurityProfile> = {
  header: "# Roles",
  accessor: "Roles",
  cell: ({row, value}) => <Text>{value.length}</Text>
}

const NumberCustomRolesColumn: DataTableColumn<SecurityProfile> = {
  header: "# Custom Roles",
  accessor: "CustomRoles",
  cell: ({row, value}) => <Text>{value.length}</Text>
}

const NameColumn: DataTableColumn<SecurityProfile> = {
  header: "NAME",
  accessor: "Name",
  cell: ({row, value}) => (
    <Link passHref href={"/settings/securityprofiles/" + row.original.ID}>
      <Text as="a" noOfLines={2} title={value}>
        {value}
      </Text>
    </Link>
  )
}

const SecurityProfileTableOptions: ListViewTableOptions<SecurityProfile> = {
  responsive: {
    base: [IdColumn, NameColumn],
    md: [IdColumn, NameColumn],
    lg: [IdColumn, NameColumn],
    xl: [IdColumn, NameColumn, NumberFeaturesColumn, NumberRolesColumn, NumberCustomRolesColumn]
  }
}

const SecurityProfileList: FC = () => {
  const [actionSecurityProfile, setActionSecurityProfile] = useState<SecurityProfile>()
  const deleteDisclosure = useDisclosure()

  const renderSecurityProfileActionMenu = useCallback(
    (securityProfile: SecurityProfile) => {
      return (
        <SecurityProfileActionMenu
          securityProfile={securityProfile}
          onOpen={() => setActionSecurityProfile(securityProfile)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [deleteDisclosure.onOpen]
  )

  const resolveSecurityProfileDetailHref = (securityprofile: SecurityProfile) => {
    return `/settings/securityprofiles/${securityprofile.ID}`
  }

  return (
    <ListView<SecurityProfile>
      service={SecurityProfiles.List}
      tableOptions={SecurityProfileTableOptions}
      paramMap={SecurityProfileParamMap}
      queryMap={SecurityProfileQueryMap}
      filterMap={SecurityProfileFilterMap}
      itemHrefResolver={resolveSecurityProfileDetailHref}
      itemActions={renderSecurityProfileActionMenu}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <SecurityProfileListToolbar {...listViewChildProps} />
          </Box>
          {renderContent}
          <SecurityProfileDeleteModal
            onComplete={listViewChildProps.removeItems}
            securityprofiles={
              actionSecurityProfile
                ? [actionSecurityProfile]
                : items
                ? items.filter((securityprofile) => listViewChildProps.selected.includes(securityprofile.ID))
                : []
            }
            disclosure={deleteDisclosure}
          />
        </Container>
      )}
    </ListView>
  )
}

export default SecurityProfileList
