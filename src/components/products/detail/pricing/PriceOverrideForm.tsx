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
  Box
} from "@chakra-ui/react"
import {PriceOverrideTable} from "./PriceOverrideTable"
import {PriceOverrideModal} from "./price-override-modal/PriceOverrideModal"
import {Control, UseFieldArrayReturn} from "react-hook-form"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {ProductDetailFormFields} from "../form-meta"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface PriceOverrideFormProps {
  control: Control<ProductDetailFormFields>
  fieldArray: UseFieldArrayReturn<ProductDetailFormFields, "OverridePriceSchedules", "id">
  overridePriceSchedules?: IPriceSchedule[]
}
export function PriceOverrideForm({control, fieldArray, overridePriceSchedules}: PriceOverrideFormProps) {
  return (
    <Card mt={6}>
      <CardBody>
        <Accordion borderColor={"transparent"} allowToggle defaultIndex={overridePriceSchedules?.length ? [0] : []}>
          <AccordionItem>
            <AccordionButton px={0}>
              <Heading fontSize="xl">Price Overrides</Heading>
              <AccordionIcon ml="auto" />
            </AccordionButton>
            <AccordionPanel pb={4} px={0}>
              <Divider />
              <Flex flexDirection="column" gap={4} mt={4}>
                {fieldArray.fields?.length ? (
                  <PriceOverrideTable fieldArray={fieldArray} control={control} />
                ) : (
                  <Box>
                    No price overrides
                    <ProtectedContent hasAccess={appPermissions.ProductManager}>
                      <>
                        ,{" "}
                        <PriceOverrideModal
                          onUpdate={(newPriceSchedule) => fieldArray.append(newPriceSchedule)}
                          step="editprice"
                          as="button"
                          buttonProps={{children: "create one now", variant: "link", marginTop: "20px"}}
                        />
                      </>
                    </ProtectedContent>
                  </Box>
                )}
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </CardBody>
    </Card>
  )
}
