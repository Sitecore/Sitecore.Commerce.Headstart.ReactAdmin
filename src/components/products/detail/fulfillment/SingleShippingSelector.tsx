import {SelectControl, SelectControlProps} from "@/components/react-hook-form"
import {AdminAddresses, ListPage, SupplierAddresses} from "ordercloud-javascript-sdk"
import {useCallback} from "react"
import {Control, useWatch} from "react-hook-form"
import {Text, VStack} from "@chakra-ui/react"
import {SingleLineAddress} from "@/components/orders/detail/SingleLineAddress"
import {appSettings} from "config/app-settings"
import {IAdminAddress} from "types/ordercloud/IAdminAddress"
import {ISupplierAddress} from "types/ordercloud/ISupplierAddress"

interface SingleShippingSelectorProps extends Omit<SelectControlProps, "name"> {
  control: Control<any>
  validationSchema: any
  showLabels?: boolean
  existingAddressIds?: string[]
}
export function SingleShippingSelector({
  control,
  validationSchema,
  showLabels = true,
  existingAddressIds,
  ...containerProps
}: SingleShippingSelectorProps) {
  const ownerId = useWatch({name: "Product.OwnerID", control})

  const getShipFromAddressOptions = useCallback(async () => {
    if (!ownerId) {
      return []
    }

    const excludeExistingAddressFilter = existingAddressIds?.length
      ? {filters: {ID: existingAddressIds.map((addressId) => `!${addressId}`)}}
      : undefined

    const sellerId = ownerId
    let addresses: ListPage<IAdminAddress | ISupplierAddress>
    if (sellerId === appSettings.marketplaceId) {
      addresses = await AdminAddresses.List(excludeExistingAddressFilter)
    } else {
      addresses = await SupplierAddresses.List(sellerId, excludeExistingAddressFilter)
    }
    return addresses.Items.map((address) => ({
      label: (
        <VStack alignItems="flex-start">
          <Text>{address.AddressName}</Text>
          <SingleLineAddress color="gray.400" fontSize="small" className="single-line-address" address={address} />
        </VStack>
      ),
      value: address.ID
    }))
  }, [ownerId, existingAddressIds])

  return (
    <SelectControl
      selectProps={{
        noOptionsMessage: () => (!existingAddressIds?.length ? "No locations" : "All locations added"),
        placeholder: "Select address",
        loadOptions: getShipFromAddressOptions,
        chakraStyles: {
          container: (baseStyles) => ({...baseStyles, whiteSpace: "nowrap", minW: "350px"}),
          singleValue: (baseStyles) => ({
            ...baseStyles,
            ".single-line-address": {display: "none"}
          })
        }
      }}
      validationSchema={validationSchema}
      label={showLabels && "Ship From"}
      name="Product.ShipFromAddressID"
      control={control}
      {...containerProps}
    />
  )
}
