import {Box, Container, Text, useDisclosure} from "@chakra-ui/react"
import Link from "next/link"
import {SupplierAddresses} from "ordercloud-javascript-sdk"
import {useCallback, useState} from "react"
import {ISupplierAddress} from "types/ordercloud/ISupplierAddress"
import {DataTableColumn} from "../../shared/DataTable/DataTable"
import ListView, {ListViewGridOptions, ListViewTableOptions} from "../../shared/ListView/ListView"
import SupplierAddressDeleteModal from "../modals/SupplierAddressDeleteModal"
import SupplierAddressActionMenu from "./SupplierAddressActionMenu"
import SupplierAddressCard from "./SupplierAddressCard"
import SupplierAddressListToolbar from "./SupplierAddressListToolbar"
import {useRouter} from "next/router"

const SupplierAddressQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}
const paramMap = {
  d: "Direction",
  supplierid: "SupplierID"
}

const IDColumn: DataTableColumn<ISupplierAddress> = {
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

const AddressNameColumn: DataTableColumn<ISupplierAddress> = {
  header: "Address Name",
  accessor: "AddressName",
  width: "15%",
  cell: ({row, value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: false
}

const Street1Column: DataTableColumn<ISupplierAddress> = {
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

const Street2Column: DataTableColumn<ISupplierAddress> = {
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

const CityColumn: DataTableColumn<ISupplierAddress> = {
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

const StateColumn: DataTableColumn<ISupplierAddress> = {
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

const ZipColumn: DataTableColumn<ISupplierAddress> = {
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

const CountryColumn: DataTableColumn<ISupplierAddress> = {
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

const SupplierAddressTableOptions: ListViewTableOptions<ISupplierAddress> = {
  responsive: {
    base: [IDColumn, AddressNameColumn],
    md: [IDColumn, AddressNameColumn, Street1Column, Street2Column, CityColumn, StateColumn],
    lg: [IDColumn, AddressNameColumn, Street1Column, Street2Column, CityColumn, StateColumn],
    xl: [IDColumn, AddressNameColumn, Street1Column, Street2Column, CityColumn, StateColumn, ZipColumn, CountryColumn]
  }
}

const SupplierAddressGridOptions: ListViewGridOptions<ISupplierAddress> = {
  renderGridItem: (supplierAddress, index, renderActions, selected, onSelectChange) => (
    <SupplierAddressCard
      key={index}
      supplierAddress={supplierAddress}
      selected={selected}
      renderSupplierAddressActions={renderActions}
      onSupplierAddressSelected={onSelectChange}
    />
  )
}

const SupplierAddressList = () => {
  const [actionSupplierAddress, setActionSupplierAddress] = useState<ISupplierAddress>()
  const deleteDisclosure = useDisclosure()
  const {query} = useRouter()
  const supplierid = query.supplierid as string
  const renderSupplierAddressActionsMenu = useCallback(
    (supplierAddress: ISupplierAddress) => {
      return (
        <SupplierAddressActionMenu
          supplierAddress={supplierAddress}
          onOpen={() => setActionSupplierAddress(supplierAddress)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [deleteDisclosure.onOpen]
  )

  const resolveSupplierAddressDetailHref = (address: ISupplierAddress) => {
    return `/suppliers/${supplierid}/addresses/${address.ID}`
  }

  return (
    <ListView<ISupplierAddress>
      service={SupplierAddresses.List}
      queryMap={SupplierAddressQueryMap}
      paramMap={paramMap}
      itemHrefResolver={resolveSupplierAddressDetailHref}
      itemActions={renderSupplierAddressActionsMenu}
      tableOptions={SupplierAddressTableOptions}
      gridOptions={SupplierAddressGridOptions}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <SupplierAddressListToolbar {...listViewChildProps} />
          </Box>
          {renderContent}
          <SupplierAddressDeleteModal
            onComplete={listViewChildProps.removeItems}
            supplierAddresses={
              actionSupplierAddress
                ? [actionSupplierAddress]
                : items
                ? items.filter((supplierAddress) => listViewChildProps.selected.includes(supplierAddress.ID))
                : []
            }
            disclosure={deleteDisclosure}
          />
        </Container>
      )}
    </ListView>
  )
}

export default SupplierAddressList
