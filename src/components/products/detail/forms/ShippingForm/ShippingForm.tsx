import {CheckboxControl, InputControl, SelectControl} from "@/components/react-hook-form"
import {Divider, Grid, GridItem} from "@chakra-ui/react"
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
      <Grid
        templateColumns={{base: "1fr", lg: "repeat(4, minmax(0, 1fr))", xl: "repeat(7, minmax(0, 1fr))"}}
        columnGap="formInputSpacing"
        justifyContent="space-between"
      >
        <GridItem>
          <InputControl
            label="Length"
            inputProps={{type: "number"}}
            name={fieldNames.SHIP_LENGTH}
            control={control}
            validationSchema={validationSchema}
          />
        </GridItem>
        <GridItem>
          <InputControl
            label="Width"
            inputProps={{type: "number"}}
            name={fieldNames.SHIP_WIDTH}
            control={control}
            validationSchema={validationSchema}
          />
        </GridItem>
        <GridItem>
          <InputControl
            label="Height"
            inputProps={{type: "number"}}
            name={fieldNames.SHIP_HEIGHT}
            control={control}
            validationSchema={validationSchema}
          />
        </GridItem>
        <GridItem>
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
        </GridItem>
        <GridItem gridColumnStart={{xl: 6}}>
          <InputControl
            label="Weight"
            inputProps={{type: "number"}}
            name={fieldNames.SHIP_WEIGHT}
            control={control}
            validationSchema={validationSchema}
          />
        </GridItem>
        <GridItem gridColumnStart={{xl: 7}}>
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
        </GridItem>
      </Grid>
      <Divider marginY="formInputSpacing" />
      <Grid templateColumns={{base: "1fr", lg: "1fr 1fr 1fr"}} alignItems="center" columnGap="formInputSpacing">
        <GridItem>
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
        </GridItem>
        <GridItem>
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
        </GridItem>
        <GridItem>
          <CheckboxControl
            label="This product is eligible for returns"
            name={fieldNames.ELIGIBLE_FOR_RETURNS}
            control={control}
            validationSchema={validationSchema}
          />
        </GridItem>
      </Grid>
    </>
  )
}
