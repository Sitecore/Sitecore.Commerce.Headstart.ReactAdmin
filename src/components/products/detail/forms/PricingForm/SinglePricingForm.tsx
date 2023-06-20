import {InputControl, NumberInputControl, SwitchControl} from "@/components/react-hook-form"
import {InfoOutlineIcon} from "@chakra-ui/icons"
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  Heading,
  Text
} from "@chakra-ui/react"
import {useErrorToast} from "hooks/useToast"
import {get} from "lodash"
import {Control, FieldValues, useFieldArray, useFormState, UseFormTrigger} from "react-hook-form"
import {validationSchema} from "../meta"
import * as fieldNames from "./fieldNames"

interface SinglePricingFormProps {
  control: Control<FieldValues, any>
  trigger: UseFormTrigger<any>
  priceBreakCount: number
  // we need a prefix to differentiate between when we are
  // modifiying the default price schedule vs an override price schedule
  fieldNamePrefix: string
}
export function SinglePricingForm({control, trigger, priceBreakCount, fieldNamePrefix}: SinglePricingFormProps) {
  const withPrefix = (fieldName: string) => {
    if (fieldNamePrefix) {
      return `${fieldNamePrefix}.${fieldName}`
    }
    return fieldName
  }
  return (
    <>
      <Card>
        <CardBody flexDirection="column" gap={4}>
          <Grid templateColumns={{base: "1fr", xl: "1fr 1fr 1fr"}} gap={4}>
            <InputControl
              name={withPrefix(`${fieldNames.PRICE_BREAKS}.${0}.Price`)}
              inputProps={{type: "number"}}
              label="Regular Price (per unit)"
              control={control}
              leftAddon="$"
              validationSchema={validationSchema}
            />

            <InputControl
              name={withPrefix(`${fieldNames.PRICE_BREAKS}.${0}.SalePrice`)}
              inputProps={{type: "number"}}
              label="Sale Price (per unit)"
              control={control}
              leftAddon="$"
              validationSchema={validationSchema}
            />

            <InputControl
              name={withPrefix(`${fieldNames.PRICE_BREAKS}.${0}.SubscriptionPrice`)}
              inputProps={{type: "number"}}
              label="Subscription Price (per unit)"
              control={control}
              leftAddon="$"
              validationSchema={validationSchema}
            />

            <Grid gap={4} gridTemplateColumns={{base: "1fr", xl: "1fr 1fr 1fr"}}>
              <InputControl
                name={withPrefix(fieldNames.SALE_START)}
                label="Sale Start"
                control={control}
                inputProps={{type: "datetime-local"}}
                validationSchema={validationSchema}
              />

              <InputControl
                name={withPrefix(fieldNames.SALE_END)}
                label="Sale End"
                control={control}
                inputProps={{type: "datetime-local"}}
                validationSchema={validationSchema}
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
                      name={withPrefix(fieldNames.RESTRICTED_QUANTITY)}
                      label="Restrict order quantity"
                      control={control}
                      validationSchema={validationSchema}
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
                        name={withPrefix(fieldNames.MIN_QUANTITY)}
                        inputProps={{type: "number"}}
                        label="Minimum quantity"
                        control={control}
                        validationSchema={validationSchema}
                      />
                      <InputControl
                        name={withPrefix(fieldNames.MAX_QUANTITY)}
                        inputProps={{type: "number"}}
                        label="Maximum quantity"
                        control={control}
                        validationSchema={validationSchema}
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

interface PriceBreakTableProps {
  control: Control<FieldValues, any>
  trigger: UseFormTrigger<any>
  fieldNamePrefix: string
}
function PriceBreakTable({control, trigger, fieldNamePrefix}: PriceBreakTableProps) {
  const {fields, append, remove} = useFieldArray({
    control,
    name: withPrefix(fieldNames.PRICE_BREAKS)
  })
  const {errors} = useFormState({control})
  const errorMessage = getPricebreakErrorMessage(errors)
  const errorToast = useErrorToast()

  const handleDeletePriceBreak = (index: number) => {
    remove(index)
  }

  const handleAddPriceBreak = async () => {
    const isValid = await trigger(withPrefix(fieldNames.PRICE_BREAKS))
    if (!isValid) {
      errorToast({description: "Please resolve errors before adding a new price break"})
      return
    }
    append({Quantity: "", Price: "", SalePrice: "", SubscriptionPrice: ""})
  }

  function getPricebreakErrorMessage(errors: any) {
    const error = get(errors, withPrefix(fieldNames.PRICE_BREAKS), "") as any
    if (error.message) {
      // error on price breaks as a whole, individual price break messages will be reported on the inputs
      return error.message
    } else {
      return ""
    }
  }

  function withPrefix(fieldName: string) {
    if (fieldNamePrefix) {
      return `${fieldNamePrefix}.${fieldName}`
    }
    return fieldName
  }

  return (
    <Box>
      <Text fontWeight="medium" marginBottom={3}>
        Volume Pricing
      </Text>
      {fields.map((field, index) => (
        <Flex key={field.id} gap={4} alignItems="end" flexWrap={{base: "wrap", lg: "nowrap"}}>
          <NumberInputControl
            numberInputProps={{flexGrow: 1}}
            name={`${withPrefix(fieldNames.PRICE_BREAKS)}.${index}.Quantity`}
            label="Quantity"
            control={control}
            validationSchema={validationSchema}
          />
          <NumberInputControl
            numberInputProps={{flexGrow: 1}}
            name={`${withPrefix(fieldNames.PRICE_BREAKS)}.${index}.Price`}
            label="Price (per unit)"
            control={control}
            leftAddon="$"
            validationSchema={validationSchema}
          />
          <NumberInputControl
            numberInputProps={{flexGrow: 1}}
            name={`${withPrefix(fieldNames.PRICE_BREAKS)}.${index}.SalePrice`}
            label="Sale Price (per unit)"
            control={control}
            leftAddon="$"
            validationSchema={validationSchema}
          />
          <NumberInputControl
            numberInputProps={{flexGrow: 1}}
            name={`${withPrefix(fieldNames.PRICE_BREAKS)}.${index}.SubscriptionPrice`}
            label="Subscription Price (per unit)"
            control={control}
            leftAddon="$"
            validationSchema={validationSchema}
          />
          {index === 0 ? (
            // this feels very wrong
            <Box minWidth="46px"></Box>
          ) : (
            <Button variant="ghost" color="danger.500" onClick={() => handleDeletePriceBreak(index)}>
              Delete
            </Button>
          )}
        </Flex>
      ))}
      <Flex justifyContent="space-between" marginTop={2}>
        <Button variant="link" color="accent.400" maxWidth="max-content" onClick={handleAddPriceBreak}>
          Add price break
        </Button>
        <FormControl isInvalid={errorMessage} maxWidth="max-content">
          <FormErrorMessage display="inline-block">
            <InfoOutlineIcon mr={2} /> {errorMessage}
          </FormErrorMessage>
        </FormControl>
      </Flex>
    </Box>
  )
}
