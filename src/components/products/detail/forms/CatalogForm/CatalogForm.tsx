import {Control, FieldValues, UseFormTrigger, useFieldArray} from "react-hook-form"
import {
  Card,
  CardBody,
  Accordion,
  AccordionItem,
  AccordionButton,
  Heading,
  AccordionIcon,
  AccordionPanel,
  Divider,
  Flex,
  Box,
  CardHeader,
  Grid
} from "@chakra-ui/react"
import { ProductCatalogAssignment } from "ordercloud-javascript-sdk"
import { CategoryProductAssignmentAdmin } from "types/form/CategoryProductAssignmentAdmin"
import { CatalogsTable } from "./CatalogsTable"


interface CatalogFormProps {
  control: Control<FieldValues, any>
  trigger: UseFormTrigger<any>
  productCatalogs?: ProductCatalogAssignment[]
  productCategories?: CategoryProductAssignmentAdmin[]
}
export function CatalogForm({control, trigger, productCatalogs, productCategories}: CatalogFormProps) {
  const fieldArray = useFieldArray({
    control,
    name: `CatalogAssignments`
  })
  return (
    <>
      <Card mt={6}>
        <CardBody>
        <Accordion borderColor={"transparent"} allowToggle defaultIndex={productCatalogs?.length ? [0] : []}>
            <AccordionItem>
              <AccordionButton px={0}>
                <Heading fontSize="xl">Catalog Assignments</Heading>
                <AccordionIcon ml="auto" />
              </AccordionButton>
              <Divider />
              <AccordionPanel pb={4} px={0}>
                <Flex flexDirection="column" gap={4} mt={4}>
                    <CatalogsTable fieldArray={fieldArray} control={control} />
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>
      <Card mt={6}>
        <CardBody>
        <Accordion borderColor={"transparent"} allowToggle defaultIndex={productCategories?.length ? [0] : []}>
            <AccordionItem>
              <AccordionButton px={0}>
                <Heading fontSize="xl">Category Assignments</Heading>
                <AccordionIcon ml="auto" />
              </AccordionButton>
              <Divider />
              <AccordionPanel pb={4} px={0}>
                <Flex flexDirection="column" gap={4} mt={4}>
                    <Grid gap={4}>
                        {productCategories.map((category, index) => (
                            <div key={category.CatalogID}>
                            {category.CatalogID} / {category.CategoryID}
                            </div>
                        ))}
                    </Grid>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>
    </>
  )
}
