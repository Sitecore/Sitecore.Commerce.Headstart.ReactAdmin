import {Control, useWatch} from "react-hook-form"
import {SingleShippingSelector} from "./SingleShippingSelector"
import {Button, HStack} from "@chakra-ui/react"
import {ProductDetailFormFields} from "../form-meta"
import {IInventoryRecord} from "types/ordercloud/IInventoryRecord"
import {appSettings} from "config/app-settings"

interface AddLocationProps {
  control: Control<ProductDetailFormFields>
  validationSchema: any
  inventoryRecords: IInventoryRecord[]
  onAdd: (companyId: string, addressId: string) => void
  loading?: boolean
}
export function AddLocationButton({control, validationSchema, inventoryRecords, onAdd, loading}: AddLocationProps) {
  const [companyId, addressId] = useWatch({
    name: ["Product.OwnerID", "Product.ShipFromAddressID"],
    control
  })

  const handleClick = () => {
    onAdd(companyId, addressId)
  }

  return (
    <HStack gap={4}>
      <SingleShippingSelector control={control} validationSchema={validationSchema} showLabels={false} />
      <Button
        variant="solid"
        colorScheme="primary"
        type="button"
        onClick={handleClick}
        isLoading={loading}
        isDisabled={
          !addressId ||
          inventoryRecords.some((record) => record.OwnerID === companyId && record.AddressID === addressId)
        }
        minW="max-content"
      >
        Add Location
      </Button>
    </HStack>
  )
}
