import {CheckboxControl, InputControl, SwitchControl} from "@/components/react-hook-form"
import {Card, CardBody, CardHeader, CardProps, Flex, Heading} from "@chakra-ui/react"
import {Control, useWatch} from "react-hook-form"
import {ProductDetailFormFields, validationSchema} from "../form-meta"

interface InventoryCardProps extends CardProps {
  control: Control<ProductDetailFormFields>
}

export function InventoryCard({control, ...cardProps}: InventoryCardProps) {
  const inventoryEnabled = useWatch({name: "Product.Inventory.Enabled", control})

  return (
    <Card {...cardProps}>
      <CardHeader>
        <Heading size="md">Inventory</Heading>
      </CardHeader>
      <CardBody>
        <Flex flexDirection="column" gap={2}>
          <SwitchControl
            label="Track Quantity"
            name="Product.Inventory.Enabled"
            control={control}
            validationSchema={validationSchema}
          />
          {inventoryEnabled && (
            // only show these fields if inventory is enabled
            <>
              <SwitchControl
                label="Track Quantity For Variants"
                name="Product.Inventory.VariantLevelTracking"
                control={control}
                validationSchema={validationSchema}
              />
              <InputControl
                mt={6}
                label="Quantity Available"
                inputProps={{type: "number"}}
                name="Product.Inventory.QuantityAvailable"
                control={control}
                validationSchema={validationSchema}
              />
              <CheckboxControl
                label="Orders can be placed exceeding the available inventory"
                name="Product.Inventory.OrderCanExceed"
                control={control}
                validationSchema={validationSchema}
              />
            </>
          )}
        </Flex>
      </CardBody>
    </Card>
  )
}
