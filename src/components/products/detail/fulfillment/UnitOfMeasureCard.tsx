import {InputControl} from "@/components/react-hook-form"
import {Card, CardBody, CardHeader, CardProps, HStack, Heading} from "@chakra-ui/react"
import {Control} from "react-hook-form"
import {ProductDetailFormFields} from "../form-meta"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"

interface UnitOfMeasureCardProps extends CardProps {
  control: Control<ProductDetailFormFields>
  validationSchema: any
}

export function UnitOfMeasureCard({control, validationSchema, ...cardProps}: UnitOfMeasureCardProps) {
  const isProductManager = useHasAccess(appPermissions.ProductManager)
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
            isDisabled={!isProductManager}
          />
          <InputControl
            label="Unit of measure"
            name="Product.xp.UnitOfMeasure"
            control={control}
            validationSchema={validationSchema}
            isDisabled={!isProductManager}
          />
        </HStack>
      </CardBody>
    </Card>
  )
}
