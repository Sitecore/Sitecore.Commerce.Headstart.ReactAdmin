import {TextareaControl} from "@/components/react-hook-form"
import {Control} from "react-hook-form"
import {ProductDetailFormFields, validationSchema} from "../form-meta"
import {Card, CardBody, CardHeader, CardProps, Heading} from "@chakra-ui/react"

interface DescriptionCardProps extends CardProps {
  control: Control<ProductDetailFormFields>
}

export function DescriptionCard({control, ...cardProps}: DescriptionCardProps) {
  return (
    <Card {...cardProps}>
      <CardHeader>
        <Heading size="md">Description</Heading>
      </CardHeader>
      <CardBody>
        <TextareaControl name="Product.Description" control={control} validationSchema={validationSchema} />
      </CardBody>
    </Card>
  )
}
