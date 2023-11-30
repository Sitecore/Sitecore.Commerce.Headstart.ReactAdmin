import {Control, useFieldArray} from "react-hook-form"
import {Card, CardBody, Heading, CardHeader, Text, Flex, VStack} from "@chakra-ui/react"
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
  const {fields, append, remove} = useFieldArray({
    control,
    name: `CatalogAssignments`
  })

  const catalogAssignments = fields as ProductCatalogAssignment[]

  const handleCatalogAdd = (catalogIds: string[]) => {
    const newCatalogAssignments = catalogIds.map((catalogId) => ({CatalogID: catalogId}))
    append(newCatalogAssignments)
  }

  const handleCatalogRemove = (index: number) => {
    remove(index)
  }

  return (
    <Card mt={6}>
      <CardHeader>
        <VStack alignItems="flex-start" width="full">
          <Heading as="h3" fontSize="lg" alignSelf={"flex-start"}>
            Catalogs
            <Text fontSize="sm" color="gray.400" fontWeight="normal" marginTop={2}>
              Define which catalogs this product is assigned to
            </Text>
          </Heading>
          <ProtectedContent hasAccess={appPermissions.ProductManager}>
            <CatalogSelect onUpdate={handleCatalogAdd} existingAssignments={catalogAssignments} />
          </ProtectedContent>
        </VStack>
      </CardHeader>
      <CardBody>
        {catalogAssignments.length > 0 ? (
          <CatalogsTable onRemove={handleCatalogRemove} catalogAssignments={catalogAssignments} />
        ) : (
          <Flex width="full" justifyContent="flex-start" marginTop={10}>
            <Text color="gray.400" fontSize="small">
              This product is not assigned to any catalogs
            </Text>
          </Flex>
        )}
      </CardBody>
    </Card>
  )
}
