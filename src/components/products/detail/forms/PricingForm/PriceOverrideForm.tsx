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
import {PriceOverridesTable} from "./PriceOverridesTable"
import {PriceOverrideModal} from "./price-override-modal/PriceOverrideModal"
import {Control, FieldValues, UseFieldArrayReturn} from "react-hook-form"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"

interface PriceOverrideFormProps {
  control: Control<FieldValues, any>
  fieldArray: UseFieldArrayReturn<FieldValues, "OverridePriceSchedules", "id">
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
                  <PriceOverridesTable fieldArray={fieldArray} control={control} />
                ) : (
                  <Box>
                    No price overrides,{" "}
                    <PriceOverrideModal
                      onUpdate={(newPriceSchedule) => fieldArray.append(newPriceSchedule)}
                      step="editprice"
                      as="button"
                      buttonProps={{children: "create one now", variant: "link", marginTop: "20px"}}
                    />
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
