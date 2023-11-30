import {Control, useFieldArray} from "react-hook-form"
import {Card, CardBody, Heading, CardHeader, Text, Flex, VStack} from "@chakra-ui/react"
import {CategoryTable} from "./CategoryTable"
import {ICategoryProductAssignment} from "types/ordercloud/ICategoryProductAssignment"
import {CategorySelect} from "./CategorySelect"
import {ProductDetailFormFields} from "../../form-meta"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface CategoriesCardProps {
  control: Control<ProductDetailFormFields>
}
export function CategoriesCard({control}: CategoriesCardProps) {
  const {fields, append, remove} = useFieldArray({
    control,
    name: `CategoryAssignments`
  })

  const categoryAssignments = fields as any as ICategoryProductAssignment[]

  const handleCategoryAdd = (newCategorySelections: ICategoryProductAssignment[]) => {
    append(newCategorySelections)
  }

  const handleCategoryRemove = (index: number) => {
    remove(index)
  }

  return (
    <Card mt={6}>
      <CardHeader>
        <VStack alignItems="flex-start" width="full">
          <Heading as="h3" fontSize="lg" alignSelf={"flex-start"}>
            Categories
            <Text fontSize="sm" color="gray.400" fontWeight="normal" marginTop={2}>
              Define which categories this product is assigned to
            </Text>
          </Heading>
          <ProtectedContent hasAccess={appPermissions.ProductManager}>
            <CategorySelect onUpdate={handleCategoryAdd} existingAssignments={categoryAssignments} />
          </ProtectedContent>
        </VStack>
      </CardHeader>
      <CardBody>
        {categoryAssignments.length > 0 ? (
          <CategoryTable categoryAssignments={categoryAssignments} onRemove={handleCategoryRemove} />
        ) : (
          <Flex width="full" justifyContent="flex-start" marginTop={10}>
            <Text color="gray.400" fontSize="small">
              This product is not assigned to any categories
            </Text>
          </Flex>
        )}
      </CardBody>
    </Card>
  )
}
