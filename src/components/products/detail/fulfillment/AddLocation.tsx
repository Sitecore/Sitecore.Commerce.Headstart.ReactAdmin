import {Control, useController, useWatch} from "react-hook-form"
import {SingleShippingSelector} from "./SingleShippingSelector"
import {Button, HStack, useDisclosure} from "@chakra-ui/react"
import {ProductDetailFormFields} from "../form-meta"
import {IInventoryRecord} from "types/ordercloud/IInventoryRecord"
import {appSettings} from "config/app-settings"
import {AdminAddressForm} from "@/components/adminaddresses"
import {Address} from "ordercloud-javascript-sdk"
import {SupplierAddressForm} from "@/components/supplieraddresses"

interface AddLocationProps {
  control: Control<ProductDetailFormFields>
  validationSchema: any
  inventoryRecords: IInventoryRecord[]
  onAdd: (companyId: string, addressId: string) => void
  loading?: boolean
}
export function AddLocation({control, validationSchema, inventoryRecords, onAdd, loading}: AddLocationProps) {
  const {onOpen: onOpenAdminAddress, onClose: onCloseAdminAddress, isOpen: isOpenAdminAddress} = useDisclosure()
  const {
    onOpen: onOpenSupplierAddress,
    onClose: onCloseSupplierAddress,
    isOpen: isOpenSupplierAddress
  } = useDisclosure()

  const {
    field: {onChange: onAddressIdChange}
  } = useController({name: "Product.ShipFromAddressID", control})

  const [companyId] = useWatch({
    name: ["Product.OwnerID"],
    control
  })

  const openAddLocationModal = () => {
    if (companyId === appSettings.marketplaceId) {
      onOpenAdminAddress()
    } else {
      onOpenSupplierAddress()
    }
  }

  const handleAddLocation = async (address: Address) => {
    onAdd(companyId, address.ID)
    onCloseAdminAddress()
    onCloseSupplierAddress()
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
          Add Location
        </Button>
      </HStack>
      <AdminAddressForm
        variant="modal"
        modalTitle="Add Location"
        isOpen={isOpenAdminAddress}
        onClose={onCloseAdminAddress}
        onCreate={handleAddLocation}
      />
      <SupplierAddressForm
        variant="modal"
        modalTitle="Add Location"
        supplierId={companyId}
        isOpen={isOpenSupplierAddress}
        onClose={onCloseSupplierAddress}
        onCreate={handleAddLocation}
      />
    </>
  )
}
