import {CheckboxControl, InputControl, SelectControl} from "@/components/react-hook-form"
import {Card, CardBody, CardHeader, CardProps, Divider, Heading, SimpleGrid} from "@chakra-ui/react"
import {AdminAddresses, SupplierAddresses} from "ordercloud-javascript-sdk"
import {useCallback} from "react"
import {Control, useWatch} from "react-hook-form"
import {IAdminAddress} from "types/ordercloud/IAdminAddress"
import {ISupplierAddress} from "types/ordercloud/ISupplierAddress"
import {ProductDetailFormFields, validationSchema} from "../form-meta"
import {getMySellerCompanyIds} from "services/currentUser.service"

interface ShippingCardProps extends CardProps {
  control: Control<ProductDetailFormFields>
}

export function ShippingCard({control, ...cardProps}: ShippingCardProps) {
  const linearUnits = ["in", "mm", "cm", "ft", "yard"]
  const weightUnits = ["lb", "kg"]
  const selectedShipFromCompanyId = useWatch({name: "Product.xp.ShipFromCompanyID", control})

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
    <Card {...cardProps}>
      <CardHeader>
        <Heading size="md">Shipping</Heading>
      </CardHeader>
      <CardBody>
        <SimpleGrid
          gridAutoFlow={{base: "row", xl: "column"}}
          gridTemplateColumns={{base: "1fr", md: "1fr 1fr", xl: "repeat(auto-fit, minmax(150px, 1fr))"}}
          gap={4}
        >
          <InputControl
            label="Length"
            inputProps={{type: "number"}}
            name="Product.ShipLength"
            control={control}
            validationSchema={validationSchema}
          />

          <InputControl
            label="Width"
            inputProps={{type: "number"}}
            name="Product.ShipWidth"
            control={control}
            validationSchema={validationSchema}
          />

          <InputControl
            label="Height"
            inputProps={{type: "number"}}
            name="Product.ShipHeight"
            control={control}
            validationSchema={validationSchema}
          />

          <SelectControl
            label="&zwnj;"
            validationSchema={validationSchema}
            name="Product.xp.ShipLinearUnit"
            control={control}
            selectProps={{
              options: linearUnits.map((unit) => ({label: unit, value: unit}))
            }}
          />

          <InputControl
            label="Weight"
            inputProps={{type: "number"}}
            name="Product.ShipWeight"
            control={control}
            validationSchema={validationSchema}
          />

          <SelectControl
            label="&zwnj;"
            validationSchema={validationSchema}
            name="Product.xp.ShipWeightUnit"
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
            name="Product.xp.ShipFromCompanyID"
            control={control}
          />

          <SelectControl
            selectProps={{
              placeholder: "Select an address",
              loadOptions: getShipFromAddressOptions
            }}
            validationSchema={validationSchema}
            label="Ship From"
            name="Product.ShipFromAddressID"
            control={control}
          />

          <CheckboxControl
            label="This product is eligible for returns"
            name="Product.Returnable"
            control={control}
            validationSchema={validationSchema}
          />
        </SimpleGrid>
      </CardBody>
    </Card>
  )
}
