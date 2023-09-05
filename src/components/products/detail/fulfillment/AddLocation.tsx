import {Control, useController, useWatch} from "react-hook-form"
import {SingleShippingSelector} from "./SingleShippingSelector"
import {Button, HStack, useDisclosure} from "@chakra-ui/react"
import {ProductDetailFormFields} from "../form-meta"
import {IInventoryRecord} from "types/ordercloud/IInventoryRecord"
import {appSettings} from "config/app-settings"
import {Address} from "ordercloud-javascript-sdk"
import {AddressForm} from "@/components/addresses"

interface AddLocationProps {
  control: Control<ProductDetailFormFields>
  validationSchema: any
  inventoryRecords: IInventoryRecord[]
  onAdd: (companyId: string, addressId: string) => void
  loading?: boolean
}
export function AddLocation({control, validationSchema, inventoryRecords, onAdd, loading}: AddLocationProps) {
  const adminAddressDisclosure = useDisclosure()
  const supplierAddressDisclosure = useDisclosure()

  const {
    field: {onChange: onAddressIdChange}
  } = useController({name: "Product.ShipFromAddressID", control})

  const [companyId] = useWatch({
    name: ["Product.OwnerID"],
    control
  })

  const openAddLocationModal = () => {
    if (companyId === appSettings.marketplaceId) {
      adminAddressDisclosure.onOpen()
    } else {
      supplierAddressDisclosure.onOpen()
    }
  }

  const handleAddLocation = async (address: Address) => {
    onAdd(companyId, address.ID)
    adminAddressDisclosure.onClose()
    supplierAddressDisclosure.onClose()
  }

  return (
    <>
      <HStack gap={4}>
        <SingleShippingSelector
          control={control}
          validationSchema={validationSchema}
          showLabels={false}
          existingAddressIds={inventoryRecords.map((record) => record.AddressID)}
          selectProps={{
            onChange: (event: any) => {
              onAdd(companyId, event.value)
              onAddressIdChange("")
            }
          }}
        />
        <Button
          variant="solid"
          colorScheme="primary"
          type="button"
          onClick={openAddLocationModal}
          isLoading={loading}
          minW="max-content"
        >
          Add new location
        </Button>
      </HStack>
      <AddressForm addressType="admin" disclosureProps={adminAddressDisclosure} onCreate={handleAddLocation} />
      <AddressForm addressType="supplier" disclosureProps={supplierAddressDisclosure} onCreate={handleAddLocation} />
    </>
  )
}
