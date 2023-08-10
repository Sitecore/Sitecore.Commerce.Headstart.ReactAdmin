import {InputControl, SelectControl, SwitchControl} from "@/components/react-hook-form"
import {Card, CardBody, CardHeader, HStack, Heading} from "@chakra-ui/react"
import {Control} from "react-hook-form"
import {ProductDetailFormFields} from "../form-meta"
import {OwnerIdSelect} from "../fulfillment/OwnerIdSelect"

type DetailsCardProps = {
  isCreatingNew: boolean
  control: Control<ProductDetailFormFields>
  validationSchema: any
}

export function DetailsCard({control, validationSchema, isCreatingNew}: DetailsCardProps) {
  return (
    <Card margin={3}>
      <CardHeader>
        <Heading size="md">Details</Heading>
      </CardHeader>
      <CardBody>
        <SwitchControl label="Active" name="Product.Active" control={control} validationSchema={validationSchema} />
        <HStack flexWrap={{base: "wrap", md: "nowrap"}} gap={6} mt={6}>
          <InputControl label="Name" name="Product.Name" control={control} validationSchema={validationSchema} />
          <InputControl
            style={{marginLeft: 0}}
            label="SKU"
            name="Product.ID"
            control={control}
            validationSchema={validationSchema}
          />
        </HStack>
        <OwnerIdSelect
          marginTop={6}
          maxWidth="50%"
          control={control}
          validationSchema={validationSchema}
          isCreatingNew={isCreatingNew}
        />
      </CardBody>
    </Card>
  )
}
