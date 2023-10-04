import {TextareaControl} from "@/components/react-hook-form"
import {Control} from "react-hook-form"
import {ProductDetailFormFields, validationSchema} from "../form-meta"
import {Card, CardBody, CardHeader, CardProps, Heading} from "@chakra-ui/react"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"

interface DescriptionCardProps extends CardProps {
  control: Control<ProductDetailFormFields>
}

export function DescriptionCard({control, ...cardProps}: DescriptionCardProps) {
  const isProductManager = useHasAccess(appPermissions.ProductManager)
  return (
    <Card {...cardProps}>
      <CardHeader>
        <Heading size="md">Description</Heading>
      </CardHeader>
      <CardBody>
        <TextareaControl
          name="Product.Description"
          control={control}
          validationSchema={validationSchema}
          isDisabled={!isProductManager}
        />
      </CardBody>
    </Card>
  )
}
