import {Box, Container, Text, useDisclosure} from "@chakra-ui/react"
import Link from "next/link"
import {AdminAddresses} from "ordercloud-javascript-sdk"
import {useCallback, useState} from "react"
import {IAdminAddress} from "types/ordercloud/IAdminAddress"
import {DataTableColumn} from "../../shared/DataTable/DataTable"
import ListView, {ListViewGridOptions, ListViewTableOptions} from "../../shared/ListView/ListView"
import AdminAddressDeleteModal from "../modals/AdminAddressDeleteModal"
import AdminAddressActionMenu from "./AdminAddressActionMenu"
import AdminAddressCard from "./AdminAddressCard"
import AdminAddressListToolbar from "./AdminAddressListToolbar"

const AdminAddressQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const IDColumn: DataTableColumn<IAdminAddress> = {
  header: "ID",
  accessor: "ID",
  width: "10%",
  cell: ({row, value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const AddressNameColumn: DataTableColumn<IAdminAddress> = {
  header: "Address Name",
  accessor: "AddressName",
  width: "15%",
  cell: ({row, value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const Street1Column: DataTableColumn<IAdminAddress> = {
  header: "Street 1",
  accessor: "Street1",
  width: "25%",
  cell: ({row, value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const Street2Column: DataTableColumn<IAdminAddress> = {
  header: "Street 2",
  accessor: "Street2",
  width: "15%",
  cell: ({row, value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const CityColumn: DataTableColumn<IAdminAddress> = {
  header: "City",
  accessor: "City",
  width: "15%",
  cell: ({row, value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const StateColumn: DataTableColumn<IAdminAddress> = {
  header: "State",
  accessor: "State",
  width: "5%",
  cell: ({row, value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const ZipColumn: DataTableColumn<IAdminAddress> = {
  header: "Zip",
  accessor: "Zip",
  width: "10%",
  cell: ({row, value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const CountryColumn: DataTableColumn<IAdminAddress> = {
  header: "Country",
  accessor: "Country",
  width: "5%",
  cell: ({row, value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const AdminAddressTableOptions: ListViewTableOptions<IAdminAddress> = {
  responsive: {
    base: [IDColumn, AddressNameColumn],
    md: [IDColumn, AddressNameColumn, Street1Column, Street2Column, CityColumn, StateColumn],
    lg: [IDColumn, AddressNameColumn, Street1Column, Street2Column, CityColumn, StateColumn],
    xl: [IDColumn, AddressNameColumn, Street1Column, Street2Column, CityColumn, StateColumn, ZipColumn, CountryColumn]
  }
}

const AdminAddressGridOptions: ListViewGridOptions<IAdminAddress> = {
  renderGridItem: (adminAddress, index, renderActions, selected, onSelectChange) => (
    <AdminAddressCard
      key={index}
      adminAddress={adminAddress}
      selected={selected}
      renderAdminAddressActions={renderActions}
      onAdminAddressSelected={onSelectChange}
    />
  )
}

const AdminAddressList = () => {
  const [actionAdminAddress, setActionAdminAddress] = useState<IAdminAddress>()
  const deleteDisclosure = useDisclosure()

  const renderAdminAddressActionsMenu = useCallback(
    (adminAddress: IAdminAddress) => {
      return (
        <AdminAddressActionMenu
          adminAddress={adminAddress}
          onOpen={() => setActionAdminAddress(adminAddress)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [deleteDisclosure.onOpen]
  )

  const resolveAdminAddressDetailHref = (address: IAdminAddress) => {
    return `/settings/adminaddresses/${address.ID}`
  }

  return (
    <ListView<IAdminAddress>
      service={AdminAddresses.List}
      queryMap={AdminAddressQueryMap}
      itemHrefResolver={resolveAdminAddressDetailHref}
      itemActions={renderAdminAddressActionsMenu}
      tableOptions={AdminAddressTableOptions}
      gridOptions={AdminAddressGridOptions}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <AdminAddressListToolbar {...listViewChildProps} />
          </Box>
          {renderContent}
          <AdminAddressDeleteModal
            onComplete={listViewChildProps.removeItems}
            adminAddresses={
              actionAdminAddress
                ? [actionAdminAddress]
                : items
                ? items.filter((adminAddress) => listViewChildProps.selected.includes(adminAddress.ID))
                : []
            }
            disclosure={deleteDisclosure}
          />
        </Container>
      )}
    </ListView>
  )
}

export default AdminAddressList
