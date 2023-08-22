import {InputControl} from "@/components/react-hook-form"
import {Card, CardBody, CardHeader, CardProps, HStack, Heading} from "@chakra-ui/react"
import {Control} from "react-hook-form"
import {ProductDetailFormFields} from "../form-meta"

interface UnitOfMeasureCardProps extends CardProps {
  control: Control<ProductDetailFormFields>
  validationSchema: any
}

export function UnitOfMeasureCard({control, validationSchema, ...cardProps}: UnitOfMeasureCardProps) {
  return (
    <Card {...cardProps}>
      <CardHeader>
        <Heading size="md">Unit of measure</Heading>
      </CardHeader>
      <CardBody>
        <HStack flexWrap={{base: "wrap", md: "nowrap"}} gap={6}>
          <InputControl
            label="Quantity per unit"
            inputProps={{type: "number"}}
            name="Product.QuantityMultiplier"
            control={control}
            validationSchema={validationSchema}
          />
          <InputControl
            label="Unit of measure"
            name="Product.xp.UnitOfMeasure.Unit"
            control={control}
            validationSchema={validationSchema}
          />
        </HStack>
      </CardBody>
    </Card>
  )
}
