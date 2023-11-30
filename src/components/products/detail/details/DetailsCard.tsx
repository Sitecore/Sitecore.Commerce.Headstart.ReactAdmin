import {InputControl, SelectControl, SwitchControl} from "@/components/react-hook-form"
import {Card, CardBody, CardHeader, HStack, Heading} from "@chakra-ui/react"
import {Control} from "react-hook-form"
import {ProductDetailFormFields} from "../form-meta"
import {OwnerIdSelect} from "../../../shared/OwnerIdSelect"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"

type DetailsCardProps = {
  isCreatingNew: boolean
  control: Control<ProductDetailFormFields>
  validationSchema: any
}

export function DetailsCard({control, validationSchema, isCreatingNew}: DetailsCardProps) {
  const isProductManager = useHasAccess(appPermissions.ProductManager)
  return (
    <Card margin={3}>
      <CardHeader>
        <Heading size="md">Details</Heading>
      </CardHeader>
      <CardBody>
        <SwitchControl
          label="Active"
          name="Product.Active"
          control={control}
          validationSchema={validationSchema}
          isDisabled={!isProductManager}
        />
        <HStack flexWrap={{base: "wrap", md: "nowrap"}} gap={6} mt={6}>
          <InputControl
            label="Name"
            name="Product.Name"
            control={control}
            validationSchema={validationSchema}
            isDisabled={!isProductManager}
          />
          <InputControl
            style={{marginLeft: 0}}
            label="ID"
            name="Product.ID"
            control={control}
            validationSchema={validationSchema}
            isDisabled={!isProductManager}
          />
        </HStack>
        <OwnerIdSelect
          name="Product.OwnerID"
          marginTop={6}
          maxWidth="50%"
          control={control}
          validationSchema={validationSchema}
          isCreatingNew={isCreatingNew}
          isDisabled={!isProductManager}
        />
      </CardBody>
    </Card>
  )
}
