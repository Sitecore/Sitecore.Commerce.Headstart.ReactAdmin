import {Control, FieldValues, useFieldArray} from "react-hook-form"
import {Card, CardBody, Heading, Box, CardHeader, Text, Icon, VStack} from "@chakra-ui/react"
import {CategoryTable} from "./CategoryTable"
import {CategoryAssignmentModal} from "./category-assignment-modal/CategoryAssignmentModal"
import {TbCactus} from "react-icons/tb"
import {ICategoryProductAssignment} from "types/ordercloud/ICategoryProductAssignment"

interface CategoryFormProps {
  control: Control<FieldValues, any>
}
export function CategoryForm({control}: CategoryFormProps) {
  const fieldArray = useFieldArray({
    control,
    name: `CategoryAssignments`
  })

  const categoryAssignments = fieldArray.fields as any as ICategoryProductAssignment[]

  if (!categoryAssignments.length) {
    return (
      <Box p={6} display="flex" flexDirection={"column"} alignItems={"center"} justifyContent={"center"} minH={"xs"}>
        <Icon as={TbCactus} fontSize={"5xl"} strokeWidth={"2px"} color="accent.500" />
        <Heading colorScheme="secondary" fontSize="xl">
          <VStack>
            <Text>This product is not assigned to any categories</Text>
            <CategoryAssignmentModal
              onUpdate={fieldArray.replace}
              as="button"
              buttonProps={{
                variant: "solid",
                size: "sm",
                colorScheme: "primary"
              }}
            />
          </VStack>
        </Heading>
      </Box>
    )
  }
  return (
    <Card mt={6}>
      <CardHeader display="flex" alignItems={"center"}>
        <Heading as="h3" fontSize="lg" alignSelf={"flex-start"}>
          Categories
          <Text fontSize="sm" color="gray.400" fontWeight="normal" marginTop={2}>
            Define which categories this product is assigned to
          </Text>
        </Heading>
        <CategoryAssignmentModal
          onUpdate={fieldArray.replace}
          as="button"
          buttonProps={{
            variant: "outline",
            colorScheme: "accent",
            ml: "auto"
          }}
        />
      </CardHeader>
      <CardBody>
        <CategoryTable fieldArray={fieldArray} control={control} />
      </CardBody>
    </Card>
  )
}
