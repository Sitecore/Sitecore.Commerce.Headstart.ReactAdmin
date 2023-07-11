import {Control, FieldValues, UseFormTrigger, useFieldArray} from "react-hook-form"
import {SinglePricingForm} from "./SinglePricingForm"
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
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {PriceOverrideModal} from "./price-override-modal/PriceOverrideModal"
import {PriceOverridesTable} from "./PriceOverridesTable"

interface PricingFormProps {
  control: Control<FieldValues, any>
  trigger: UseFormTrigger<any>
  priceBreakCount: number
  overridePriceSchedules?: IPriceSchedule[]
}
export function PricingForm({control, trigger, priceBreakCount, overridePriceSchedules}: PricingFormProps) {
  const fieldArray = useFieldArray({
    control,
    name: `OverridePriceSchedules`
  })
  return (
    <>
      <SinglePricingForm
        fieldNamePrefix="DefaultPriceSchedule"
        control={control}
        trigger={trigger}
        priceBreakCount={priceBreakCount}
      />
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
    </>
  )
}
