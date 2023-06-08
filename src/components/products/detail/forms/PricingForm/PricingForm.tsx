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
import {useState} from "react"
import {Control, FieldValues, useFieldArray, useFormState, UseFormTrigger} from "react-hook-form"
import {validationSchema} from "../meta"
import * as fieldNames from "./fieldNames"

interface PriceBreakTableProps {
  control: Control<FieldValues, any>
  trigger: UseFormTrigger<any>
}
const PriceBreakTable = ({control, trigger}: PriceBreakTableProps) => {
  const {fields, append, remove} = useFieldArray({
    control,
    name: fieldNames.PRICE_BREAKS
  })
  const {errors} = useFormState({control})
  const errorMessage = getPricebreakErrorMessage(errors)
  const errorToast = useErrorToast()

  const handleDeletePriceBreak = (index: number) => {
    remove(index)
  }

  const handleAddPriceBreak = async () => {
    const isValid = await trigger(fieldNames.PRICE_BREAKS)
    if (!isValid) {
      errorToast({description: "Please resolve errors before adding a new price break"})
      return
    }
    append({Quantity: "", Price: "", SalePrice: ""})
  }

  function getPricebreakErrorMessage(errors: any) {
    const error = get(errors, fieldNames.PRICE_BREAKS, "") as any
    if (error.message) {
      // error on price breaks as a whole, individual price break messages will be reported on the inputs
      return error.message
    } else {
      return ""
    }
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
            name={`${fieldNames.PRICE_BREAKS}.${index}.Quantity`}
            label="Quantity"
            control={control}
            validationSchema={validationSchema}
          />
          <NumberInputControl
            numberInputProps={{flexGrow: 1}}
            name={`${fieldNames.PRICE_BREAKS}.${index}.Price`}
            label="Price (per unit)"
            control={control}
            leftAddon="$"
            validationSchema={validationSchema}
          />
          <NumberInputControl
            numberInputProps={{flexGrow: 1}}
            name={`${fieldNames.PRICE_BREAKS}.${index}.SalePrice`}
            label="Sale Price (per unit)"
            control={control}
            leftAddon="$"
            validationSchema={validationSchema}
          />
          <NumberInputControl
            numberInputProps={{flexGrow: 1}}
            name={`${fieldNames.PRICE_BREAKS}.${index}.SubscriptionPrice`}
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
        <Text fontWeight="medium" color="accent.400" maxWidth="max-content" onClick={handleAddPriceBreak}>
          Add price break
        </Text>
        <FormControl isInvalid={errorMessage} maxWidth="max-content">
          <FormErrorMessage display="inline-block">
            <InfoOutlineIcon mr={2} /> {errorMessage}
          </FormErrorMessage>
        </FormControl>
      </Flex>
    </Box>
  )
}

interface PricingFormProps {
  control: Control<FieldValues, any>
  trigger: UseFormTrigger<any>
  priceBreakCount: number
}
export function PricingForm({control, trigger, priceBreakCount}: PricingFormProps) {
  const [showAdvancedPricing, setShowAdvancedPricing] = useState(priceBreakCount > 1)
  return (
    <>
      <Card>
        <CardBody flexDirection="column" gap={4}>
          <Grid templateColumns={{base: "1fr", xl: "1fr 1fr 1fr"}} gap={4}>
            <InputControl
              name={`${fieldNames.PRICE_BREAKS}.${0}.Price`}
              label="Regular Price (per unit)"
              control={control}
              leftAddon="$"
              validationSchema={validationSchema}
            />

            <InputControl
              name={`${fieldNames.PRICE_BREAKS}.${0}.SalePrice`}
              label="Sale Price (per unit)"
              control={control}
              leftAddon="$"
              validationSchema={validationSchema}
            />

            <InputControl
              name={`${fieldNames.PRICE_BREAKS}.${0}.SubscriptionPrice`}
              label="Subscription Price (per unit)"
              control={control}
              leftAddon="$"
              validationSchema={validationSchema}
            />

            <Grid gap={4} gridTemplateColumns={{base: "1fr", xl: "1fr 1fr 1fr"}}>
              <InputControl
                name={fieldNames.SALE_START}
                label="Sale Start"
                control={control}
                inputProps={{type: "datetime-local"}}
                validationSchema={validationSchema}
              />

              <InputControl
                name={fieldNames.SALE_END}
                label="Sale End"
                control={control}
                inputProps={{type: "datetime-local"}}
                validationSchema={validationSchema}
              />
            </Grid>
          </Grid>
          <Text
            fontWeight="medium"
            maxWidth="max-content"
            onClick={() => setShowAdvancedPricing(showAdvancedPricing ? false : true)}
          ></Text>
        </CardBody>
      </Card>
      <Card mt={6}>
        <CardBody>
          <Accordion borderColor={"transparent"} allowToggle>
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
                      name={fieldNames.RESTRICTED_QUANTITY}
                      label="Restrict order quantity"
                      control={control}
                      validationSchema={validationSchema}
                    />
                    <Text fontSize="sm" color="gray">
                      Require customers to order only in quantities specified in the volume pricing table
                    </Text>
                  </Box>
                  <PriceBreakTable control={control} trigger={trigger} />
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" marginBottom={3}>
                      Order Limitations
                    </Text>
                    <Flex gap={4} flexWrap={{base: "wrap", lg: "nowrap"}}>
                      <InputControl
                        name={fieldNames.MIN_QUANTITY}
                        label="Minimum quantity"
                        control={control}
                        validationSchema={validationSchema}
                      />
                      <InputControl
                        name={fieldNames.MAX_QUANTITY}
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
