import {CheckboxControl, InputControl, SelectControl} from "@/components/react-hook-form"
import {Card, CardBody, CardHeader, CardProps, Divider, Flex, Heading, SimpleGrid, VStack} from "@chakra-ui/react"
import {Control, useWatch} from "react-hook-form"
import {ProductDetailFormFields} from "../form-meta"
import {MultiShippingSelector} from "./MultiShippingSelector"
import {SingleShippingSelector} from "./SingleShippingSelector"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"

interface ShippingAndInventoryCardProps extends CardProps {
  control: Control<ProductDetailFormFields>
  validationSchema: any
}

export function ShippingAndInventoryCard({control, validationSchema, ...cardProps}: ShippingAndInventoryCardProps) {
  const isProductManager = useHasAccess(appPermissions.ProductManager)
  const linearUnits = ["in", "mm", "cm", "ft", "yard"]
  const weightUnits = ["lb", "kg"]
  const [shipsFromMultipleLocations, inventoryEnabled] = useWatch({
    name: ["Product.xp.ShipsFromMultipleLocations", "Product.Inventory.Enabled"],
    control
  })

  return (
    <Card {...cardProps}>
      <CardHeader>
        <Heading size="md">Shipping & Inventory</Heading>
      </CardHeader>
      <CardBody>
        <Flex flexDirection="column" gap={6}>
          <VStack alignItems="flex-start" gap={3}>
            <CheckboxControl
              width="full"
              label="This product fulfills from multiple locations"
              name="Product.xp.ShipsFromMultipleLocations"
              control={control}
              validationSchema={validationSchema}
              isDisabled={!isProductManager}
            />
            {shipsFromMultipleLocations ? (
              <MultiShippingSelector control={control} validationSchema={validationSchema} />
            ) : (
              <SingleShippingSelector
                selectProps={{}}
                width="md"
                control={control}
                validationSchema={validationSchema}
              />
            )}
          </VStack>
          {!shipsFromMultipleLocations && <Divider />}
          {!shipsFromMultipleLocations && (
            <VStack alignItems="flex-start">
              {!shipsFromMultipleLocations && (
                <CheckboxControl
                  label="Enable Inventory tracking"
                  name="Product.Inventory.Enabled"
                  control={control}
                  validationSchema={validationSchema}
                  isDisabled={!isProductManager}
                />
              )}
              {!shipsFromMultipleLocations && inventoryEnabled && (
                <>
                  <InputControl
                    label="Quantity Available"
                    inputProps={{type: "number"}}
                    name="Product.Inventory.QuantityAvailable"
                    control={control}
                    validationSchema={validationSchema}
                    isDisabled={!isProductManager}
                  />
                  <CheckboxControl
                    label="Orders can be placed exceeding the available inventory"
                    name="Product.Inventory.OrderCanExceed"
                    control={control}
                    validationSchema={validationSchema}
                    isDisabled={!isProductManager}
                  />
                </>
              )}
            </VStack>
          )}
          <Divider />
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
              isDisabled={!isProductManager}
            />

            <InputControl
              label="Width"
              inputProps={{type: "number"}}
              name="Product.ShipWidth"
              control={control}
              validationSchema={validationSchema}
              isDisabled={!isProductManager}
            />

            <InputControl
              label="Height"
              inputProps={{type: "number"}}
              name="Product.ShipHeight"
              control={control}
              validationSchema={validationSchema}
              isDisabled={!isProductManager}
            />

            <SelectControl
              label="&zwnj;"
              validationSchema={validationSchema}
              name="Product.xp.ShipLinearUnit"
              control={control}
              isDisabled={!isProductManager}
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
              isDisabled={!isProductManager}
            />

            <SelectControl
              label="&zwnj;"
              validationSchema={validationSchema}
              name="Product.xp.ShipWeightUnit"
              control={control}
              isDisabled={!isProductManager}
              selectProps={{options: weightUnits.map((unit) => ({label: unit, value: unit}))}}
            />
          </SimpleGrid>
          <CheckboxControl
            label="This product is eligible for returns"
            name="Product.Returnable"
            control={control}
            validationSchema={validationSchema}
            isDisabled={!isProductManager}
          />
        </Flex>
      </CardBody>
    </Card>
  )
}
