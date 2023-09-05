import {InputControl, SwitchControl} from "@/components/react-hook-form"
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  Grid,
  Heading,
  Text
} from "@chakra-ui/react"
import {Control, UseFormTrigger} from "react-hook-form"
import {validationSchema} from "../form-meta"
import {PriceBreakTable} from "./PricebreakTable"
import {OverridePriceScheduleFieldValues} from "types/form/OverridePriceScheduleFieldValues"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"

interface PriceFormProps {
  control: Control<OverridePriceScheduleFieldValues>
  trigger: UseFormTrigger<any>
  priceBreakCount: number
  fieldNamePrefix: string
}
export function PriceForm({control, trigger, priceBreakCount, fieldNamePrefix}: PriceFormProps) {
  // we need a prefix to differentiate between when we are
  // modifiying the default price schedule vs an override price schedule
  const withPrefix = (fieldName: string) => {
    if (fieldNamePrefix) {
      return `${fieldNamePrefix}.${fieldName}`
    }
    return fieldName
  }
  const isProductManager = useHasAccess(appPermissions.ProductManager)
  return (
    <>
      <Card>
        <CardBody flexDirection="column" gap={4}>
          <Grid templateColumns={{base: "1fr", xl: "1fr 1fr 1fr"}} gap={4}>
            <InputControl
              name={withPrefix(`PriceBreaks.${0}.Price`)}
              inputProps={{type: "number"}}
              label="Regular Price (per unit)"
              control={control}
              leftAddon="$"
              validationSchema={validationSchema}
              isDisabled={!isProductManager}
            />

            <InputControl
              name={withPrefix(`PriceBreaks.${0}.SalePrice`)}
              inputProps={{type: "number"}}
              label="Sale Price (per unit)"
              control={control}
              leftAddon="$"
              validationSchema={validationSchema}
              isDisabled={!isProductManager}
            />

            <InputControl
              name={withPrefix(`PriceBreaks.${0}.SubscriptionPrice`)}
              inputProps={{type: "number"}}
              label="Subscription Price (per unit)"
              control={control}
              leftAddon="$"
              validationSchema={validationSchema}
              isDisabled={!isProductManager}
            />

            <Grid gap={4} gridTemplateColumns={{base: "1fr", xl: "1fr 1fr 1fr"}}>
              <InputControl
                name={withPrefix("SaleStart")}
                label="Sale Start"
                control={control}
                inputProps={{type: "datetime-local"}}
                validationSchema={validationSchema}
                isDisabled={!isProductManager}
              />

              <InputControl
                name={withPrefix("SaleEnd")}
                label="Sale End"
                control={control}
                inputProps={{type: "datetime-local"}}
                validationSchema={validationSchema}
                isDisabled={!isProductManager}
              />
            </Grid>
          </Grid>
        </CardBody>
      </Card>
      <Card mt={6}>
        <CardBody>
          <Accordion borderColor={"transparent"} allowToggle defaultIndex={priceBreakCount > 1 ? [0] : []}>
            <AccordionItem>
              <AccordionButton px={0}>
                <Heading fontSize="xl">Advanced Pricing</Heading>
                <AccordionIcon ml="auto" />
              </AccordionButton>
              <AccordionPanel pb={4} px={0}>
                <Divider />
                <Flex flexDirection="column" gap={4} mt={4}>
                  <Box>
                    <SwitchControl
                      switchProps={{size: "md"}}
                      name={withPrefix("RestrictedQuantity")}
                      label="Restrict order quantity"
                      control={control}
                      validationSchema={validationSchema}
                      isDisabled={!isProductManager}
                    />
                    <Text fontSize="sm" color="gray">
                      Require customers to order only in quantities specified in the volume pricing table
                    </Text>
                  </Box>
                  <PriceBreakTable control={control} trigger={trigger} fieldNamePrefix={fieldNamePrefix} />
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" marginBottom={3}>
                      Order Limitations
                    </Text>
                    <Flex gap={4} flexWrap={{base: "wrap", lg: "nowrap"}}>
                      <InputControl
                        name={withPrefix("MinQuantity")}
                        inputProps={{type: "number"}}
                        label="Minimum quantity"
                        control={control}
                        validationSchema={validationSchema}
                        isDisabled={!isProductManager}
                      />
                      <InputControl
                        name={withPrefix("MaxQuantity")}
                        inputProps={{type: "number"}}
                        label="Maximum quantity"
                        control={control}
                        validationSchema={validationSchema}
                        isDisabled={!isProductManager}
                      />
                    </Flex>
                  </Box>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>
    </>
  )
}
