import {CheckboxControl, InputControl, SelectControl} from "@/components/react-hook-form"
import {Divider, SimpleGrid} from "@chakra-ui/react"
import {AdminAddresses, SupplierAddresses} from "ordercloud-javascript-sdk"
import {useCallback} from "react"
import {Control, FieldValues, useWatch} from "react-hook-form"
import {getMySellerCompanyIds} from "services/currentUser"
import {IAdminAddress} from "types/ordercloud/IAdminAddress"
import {ISupplierAddress} from "types/ordercloud/ISupplierAddress"
import {validationSchema} from "../meta"
import * as fieldNames from "./fieldNames"

type ShippingFormProps = {
  control: Control<FieldValues, any>
}

export function ShippingForm({control}: ShippingFormProps) {
  const linearUnits = ["in", "mm", "cm", "ft", "yard"]
  const weightUnits = ["lb", "kg"]
  const selectedShipFromCompanyId = useWatch({name: fieldNames.SHIP_FROM_COMPANYID, control})

  const getShipFromCompanyOptions = useCallback(async () => {
    const sellerCompanyIds = await getMySellerCompanyIds()
    return sellerCompanyIds.map((companyId) => ({
      label: companyId === "Admin" ? "Admin" : `Supplier: ${companyId}`,
      value: companyId
    }))
  }, [])

  const getShipFromAddressOptions = useCallback(async () => {
    if (!selectedShipFromCompanyId) {
      return []
    }
    let addresses
    if (selectedShipFromCompanyId == "Admin") {
      addresses = await AdminAddresses.List<IAdminAddress>()
    } else {
      addresses = await SupplierAddresses.List<ISupplierAddress>(selectedShipFromCompanyId)
    }
    return addresses.Items.map((address) => ({label: address.AddressName, value: address.ID}))
  }, [selectedShipFromCompanyId])

  return (
    <>
      <SimpleGrid
        gridAutoFlow={{base: "row", xl: "column"}}
        gridTemplateColumns={{base: "1fr", md: "1fr 1fr", xl: "repeat(auto-fit, minmax(100px, 1fr))"}}
        gap={4}
      >
        <InputControl
          label="Length"
          inputProps={{type: "number"}}
          name={fieldNames.SHIP_LENGTH}
          control={control}
          validationSchema={validationSchema}
        />

        <InputControl
          label="Width"
          inputProps={{type: "number"}}
          name={fieldNames.SHIP_WIDTH}
          control={control}
          validationSchema={validationSchema}
        />

        <InputControl
          label="Height"
          inputProps={{type: "number"}}
          name={fieldNames.SHIP_HEIGHT}
          control={control}
          validationSchema={validationSchema}
        />

        <SelectControl
          label="&zwnj;"
          validationSchema={validationSchema}
          name={fieldNames.SHIP_LINEAR_UNIT}
          control={control}
          selectProps={{
            options: linearUnits.map((unit) => ({label: unit, value: unit}))
          }}
        />

        <InputControl
          label="Weight"
          inputProps={{type: "number"}}
          name={fieldNames.SHIP_WEIGHT}
          control={control}
          validationSchema={validationSchema}
        />

        <SelectControl
          label="&zwnj;"
          validationSchema={validationSchema}
          name={fieldNames.SHIP_WEIGHT_UNIT}
          control={control}
          selectProps={{options: weightUnits.map((unit) => ({label: unit, value: unit}))}}
        />
      </SimpleGrid>

      <Divider my={4} />

      <SimpleGrid
        gridTemplateColumns={{base: "1fr", md: "1fr 1fr", xl: "repeat(auto-fit, minmax(400px, 1fr))"}}
        gap={4}
      >
        <SelectControl
          selectProps={{
            placeholder: "Select a company",
            loadOptions: getShipFromCompanyOptions
          }}
          label="Ship From Company"
          validationSchema={validationSchema}
          name={fieldNames.SHIP_FROM_COMPANYID}
          control={control}
        />

        <SelectControl
          selectProps={{
            placeholder: "Select an address",
            loadOptions: getShipFromAddressOptions
          }}
          validationSchema={validationSchema}
          label="Ship From"
          name={fieldNames.SHIP_FROM}
          control={control}
        />

        <CheckboxControl
          label="This product is eligible for returns"
          name={fieldNames.ELIGIBLE_FOR_RETURNS}
          control={control}
          validationSchema={validationSchema}
        />
      </SimpleGrid>
    </>
  )
}
