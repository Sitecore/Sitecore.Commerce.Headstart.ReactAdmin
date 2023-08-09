import {Control, useFieldArray} from "react-hook-form"
import {ProductDetailFormFields} from "../form-meta"
import {Button, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr} from "@chakra-ui/react"
import {SingleLineAddress} from "@/components/orders/detail/SingleLineAddress"
import {InputControl, SwitchControl} from "@/components/react-hook-form"
import {AddLocation} from "./AddLocation"
import {useState} from "react"
import {AdminAddresses, SupplierAddresses} from "ordercloud-javascript-sdk"
import {appSettings} from "config/app-settings"

interface MultiShippingSelectorProps {
  control: Control<ProductDetailFormFields>
  validationSchema: any
}
export function MultiShippingSelector({control, validationSchema}: MultiShippingSelectorProps) {
  const [loadingAddLocation, setLoadingAddLocation] = useState(false)
  const {
    fields: inventoryRecords,
    append,
    remove
  } = useFieldArray({
    control,
    name: "InventoryRecords"
  })

  const handleAddLocation = async (companyId: string, addressId: string) => {
    try {
      setLoadingAddLocation(true)
      const address =
        companyId === appSettings.marketplaceId
          ? await AdminAddresses.Get(addressId)
          : await SupplierAddresses.Get(companyId, addressId)
      append({
        AddressID: addressId,
        Address: address,
        OwnerID: companyId,
        QuantityAvailable: 0,
        OrderCanExceed: false,
        AllowAllBuyers: true
      })
    } finally {
      setLoadingAddLocation(false)
    }
  }

  return (
    <>
      <TableContainer marginBottom={3}>
        <Table>
          <Thead role="rowgroup">
            <Tr role="row">
              <Th role="columnheader">Location</Th>
              <Th role="columnheader">Quantity Available</Th>
              <Th role="columnheader">Can exceed inventory</Th>
              <Th role="columnheader" aria-label="Remove"></Th>
            </Tr>
          </Thead>
          <Tbody role="rowgroup">
            {inventoryRecords.length ? (
              inventoryRecords.map((field, index) => (
                <Tr key={field.id} role="row">
                  <Td>
                    <Text>{field.Address.AddressName}</Text>
                    <Text color="gray.400" fontSize="small">
                      <SingleLineAddress address={field.Address} />
                    </Text>
                  </Td>
                  <Td>
                    <InputControl
                      name={`InventoryRecords.${index}.QuantityAvailable`}
                      control={control}
                      validationSchema={validationSchema}
                    />
                  </Td>
                  <Td>
                    <SwitchControl
                      name={`InventoryRecords.${index}.OrderCanExceed`}
                      control={control}
                      validationSchema={validationSchema}
                    />
                  </Td>
                  <Td>
                    <Button variant="outline" colorScheme="danger" onClick={() => remove(index)}>
                      Remove
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={4}>
                  <Text>No locations</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <AddLocation
        control={control}
        validationSchema={validationSchema}
        inventoryRecords={inventoryRecords}
        onAdd={handleAddLocation}
        loading={loadingAddLocation}
      />
    </>
  )
}
