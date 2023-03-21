import {CheckboxControl, InputControl, SelectControl} from "@/components/formik"
import {Divider, Grid, GridItem} from "@chakra-ui/react"
import {useFormikContext} from "formik"
import {get} from "lodash"
import {AdminAddresses, Me, SupplierAddresses, Suppliers} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import {IAdminAddress} from "types/ordercloud/IAdminAddress"
import {IProduct} from "types/ordercloud/IProduct"
import {ISupplierAddress} from "types/ordercloud/ISupplierAddress"
import {validationSchema} from "../meta"
import * as fieldNames from "./fieldNames"

type ShippingFormProps = {}

export function ShippingForm({}: ShippingFormProps) {
  const [sellerCompanyIds, setSellerCompanyIds] = useState([] as string[])
  const [sellerAddress, setSellerAddresses] = useState([] as (IAdminAddress | ISupplierAddress)[])
  const [loading, setLoading] = useState(false)
  const {setFieldValue, values} = useFormikContext()
  const linearUnits = ["in", "mm", "cm", "ft", "yard"]
  const weightUnits = ["lb", "kg"]

  useEffect(() => {
    const getInitialSellerId = async () => {
      const me = await Me.Get()
      const sellerId = me.Seller?.ID ? "Admin" : me?.Supplier?.ID
      if (sellerId === "Admin") {
        // an admin can see their own company and all suppliers
        const suppliers = await Suppliers.List()
        setSellerCompanyIds([sellerId, ...suppliers.Items.map((supplier) => supplier.ID)])
      } else {
        // a supplier user can only see their own company
        setSellerCompanyIds([sellerId])
      }
      setFieldValue(fieldNames.SHIP_FROM_COMPANYID, sellerId)
    }

    getInitialSellerId()
  }, [setFieldValue])

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
    const companyId = values && get(values, fieldNames.SHIP_FROM_COMPANYID, null)
    if (companyId) {
      getSellerAddresses(companyId)
    }
  }, [values, setFieldValue])

  return (
    <>
      <Grid
        templateColumns={{base: "1fr", lg: "repeat(4, minmax(0, 1fr))", xl: "repeat(7, minmax(0, 1fr))"}}
        columnGap={15}
        justifyContent="space-between"
      >
        <GridItem>
          <InputControl
            label="Length"
            inputProps={{type: "number"}}
            name={fieldNames.SHIP_LENGTH}
            validationSchema={validationSchema}
          />
        </GridItem>
        <GridItem>
          <InputControl
            label="Width"
            inputProps={{type: "number"}}
            name={fieldNames.SHIP_WIDTH}
            validationSchema={validationSchema}
          />
        </GridItem>
        <GridItem>
          <InputControl
            label="Height"
            inputProps={{type: "number"}}
            name={fieldNames.SHIP_HEIGHT}
            validationSchema={validationSchema}
          />
        </GridItem>
        <GridItem>
          <SelectControl label="&zwnj;" validationSchema={validationSchema} name={fieldNames.SHIP_LINEAR_UNIT}>
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
            validationSchema={validationSchema}
          />
        </GridItem>
        <GridItem gridColumnStart={{xl: 7}}>
          <SelectControl label="&zwnj;" validationSchema={validationSchema} name={fieldNames.SHIP_LINEAR_UNIT}>
            {weightUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </SelectControl>
        </GridItem>
      </Grid>
      <Divider marginY={3} />
      <Grid templateColumns={{base: "1fr", lg: "1fr 1fr 1fr"}} alignItems="center" columnGap={15}>
        <GridItem>
          <SelectControl
            selectProps={{
              placeholder: "Select a company"
            }}
            label="Ship From Company"
            validationSchema={validationSchema}
            name={fieldNames.SHIP_FROM_COMPANYID}
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
            validationSchema={validationSchema}
          />
        </GridItem>
      </Grid>
    </>
  )
}
