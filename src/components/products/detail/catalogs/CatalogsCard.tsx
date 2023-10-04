import {Control, useFieldArray, useWatch} from "react-hook-form"
import {Card, CardBody, Heading, CardHeader, Text, Flex} from "@chakra-ui/react"
import {CatalogsTable} from "./CatalogTable"
import {ProductCatalogAssignment} from "ordercloud-javascript-sdk"
import {CatalogSelect} from "./CatalogSelect"
import {ProductDetailFormFields} from "../form-meta"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface CatalogsCardProps {
  control: Control<ProductDetailFormFields>
}
export function CatalogsCard({control}: CatalogsCardProps) {
  const fieldArray = useFieldArray({
    control,
    name: `CatalogAssignments`
  })

  const fieldValues = useWatch({control, name: `CatalogAssignments`})

  const catalogAssignments = fieldArray.fields as ProductCatalogAssignment[]

  const handleCatalogAdd = (catalogIds: string[]) => {
    const newCatalogAssignments = catalogIds.map((catalogId) => ({CatalogID: catalogId}))
    fieldArray.append(newCatalogAssignments)
  }

  return (
    <Card mt={6}>
      <CardHeader display="flex" justifyContent="space-between" alignItems={"center"}>
        <Heading as="h3" fontSize="lg" alignSelf={"flex-start"}>
          Catalogs
          <Text fontSize="sm" color="gray.400" fontWeight="normal" marginTop={2}>
            Define which catalogs this product is assigned to
          </Text>
        </Heading>
        <ProtectedContent hasAccess={appPermissions.ProductManager}>
          <CatalogSelect onUpdate={handleCatalogAdd} existingAssignments={fieldValues} />
        </ProtectedContent>
      </CardHeader>
      <CardBody>
        {catalogAssignments.length > 0 ? (
          <CatalogsTable fieldArray={fieldArray} control={control} />
        ) : (
          <Flex justifyContent="center">
            <Text color="gray.400" fontSize="small">
              This product is not assigned to any catalogs
            </Text>
          </Flex>
        )}
      </CardBody>
    </Card>
  )
}
