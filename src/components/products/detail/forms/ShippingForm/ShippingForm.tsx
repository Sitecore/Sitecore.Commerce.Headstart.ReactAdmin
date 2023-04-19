import {CheckboxControl, InputControl, SelectControl} from "@/components/react-hook-form"
import {Box, Divider, Flex, Grid, GridItem, HStack, SimpleGrid} from "@chakra-ui/react"
import {unset} from "lodash"
import {AdminAddresses, Me, SupplierAddresses, Suppliers} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
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
  const [sellerCompanyIds, setSellerCompanyIds] = useState([] as string[])
  const [sellerAddress, setSellerAddresses] = useState([] as (IAdminAddress | ISupplierAddress)[])
  const [loading, setLoading] = useState(false)
  const linearUnits = ["in", "mm", "cm", "ft", "yard"]
  const weightUnits = ["lb", "kg"]
  const watchedCompanyId = useWatch({name: fieldNames.SHIP_FROM_COMPANYID, control})

  useEffect(() => {
    const getSellerCompanyIds = async () => {
      setSellerCompanyIds(await getMySellerCompanyIds())
    }
    getSellerCompanyIds()
  }, [])

  useEffect(() => {
    const getSellerAddresses = async (selectedSellerId: string) => {
      try {
        setLoading(true)
        let addresses
        if (selectedSellerId == "Admin") {
          addresses = await AdminAddresses.List<IAdminAddress>()
        } else {
          addresses = await SupplierAddresses.List<ISupplierAddress>(selectedSellerId)
        }
        setSellerAddresses(addresses.Items)
      } finally {
        setLoading(false)
      }
    }
    if (watchedCompanyId) {
      getSellerAddresses(watchedCompanyId)
    }
  }, [watchedCompanyId])

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
        >
          {linearUnits.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </SelectControl>

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
          name={fieldNames.SHIP_LINEAR_UNIT}
          control={control}
        >
          {weightUnits.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </SelectControl>
      </SimpleGrid>

      <Divider my={4} />

      <SimpleGrid
        gridTemplateColumns={{base: "1fr", md: "1fr 1fr", xl: "repeat(auto-fit, minmax(400px, 1fr))"}}
        gap={4}
      >
        <SelectControl
          selectProps={{
            placeholder: "Select a company"
          }}
          label="Ship From Company"
          validationSchema={validationSchema}
          name={fieldNames.SHIP_FROM_COMPANYID}
          control={control}
        >
          {sellerCompanyIds.map((companyId) => (
            <option key={companyId} value={companyId}>
              {companyId === "Admin" ? "Admin" : `Supplier: ${companyId}`}
            </option>
          ))}
        </SelectControl>

        <SelectControl
          selectProps={{placeholder: "Select an address"}}
          validationSchema={validationSchema}
          label="Ship From"
          name={fieldNames.SHIP_FROM}
          control={control}
          isDisabled={loading}
        >
          {sellerAddress.map((address) => (
            <option key={address.ID} value={address.ID}>
              {address.AddressName}
            </option>
          ))}
        </SelectControl>

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
