import {InputControl, NumberInputControl, SwitchControl} from "@/components/react-hook-form"
import {ChevronDownIcon, ChevronRightIcon, InfoOutlineIcon} from "@chakra-ui/icons"
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  Heading,
  Text,
  useDisclosure
} from "@chakra-ui/react"
import {useErrorToast} from "hooks/useToast"
import {compact, get} from "lodash"
import {useEffect, useState} from "react"
import {Control, FieldValues, useFieldArray, useFormState, UseFormTrigger, useWatch} from "react-hook-form"
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
  const watchFields = useWatch({control, name: fieldNames.PRICE_BREAKS})
  const errorMessage = getPricebreakErrorMessage(errors)
  const errorToast = useErrorToast()

  useEffect(() => {
    // trigger validation whenever any change to the individual price break fields change
    // without this, validation is only run when a price break is added but we want
    // it to validate before so we can prevent the creation of a new price break if there
    // are any invalid ones
    trigger(fieldNames.PRICE_BREAKS)
  }, [watchFields, trigger])

  const handleDeletePriceBreak = (index: number) => {
    remove(index)
  }

  const handleAddPriceBreak = () => {
    if (errorMessage) {
      errorToast({description: errorMessage})
      return
    }
    append({Quantity: "", Price: "", SalePrice: ""})
  }

  function getPricebreakErrorMessage(errors: any) {
    const error = get(errors, fieldNames.PRICE_BREAKS, "") as any
    if (error.message) {
      // error on price breaks as a whole
      return error.message
    }
    if (error.length) {
      // get first error on an individual price break
      const individualErrors = compact(error) as any[]
      if (individualErrors.length) {
        const firstError = individualErrors[0]
        const keys = Object.keys(firstError)
        return firstError[keys[0]].message
      }
    }
    return ""
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
        <Text fontWeight="medium" color="brand.400" maxWidth="max-content" onClick={handleAddPriceBreak}>
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
  const {isOpen, onToggle} = useDisclosure()
  return (
    <>
      <Flex flexDirection="column" gap={4}>
        <Grid templateColumns={{base: "1fr", xl: "1fr 1fr"}} gap={4}>
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

          <Grid gap={4} gridTemplateColumns={{base: "1fr", xl: "1fr 1fr"}}>
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
        >
          {/* {showAdvancedPricing ? <ChevronDownIcon boxSize={6} /> : <ChevronRightIcon boxSize={6} />} Advanced Pricing */}
        </Text>
        {/* {showAdvancedPricing && ( */}

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
        {/* )} */}
      </Flex>
    </>
  )
}

{
  /* <Grid templateColumns={{base: "1fr", xl: "1fr 1fr"}} gap="formInputSpacing">
          <GridItem>
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
          
          
            <Grid gap="formInputSpacing" gridTemplateColumns={{base: "1fr", xl: "1fr 1fr"}}>
              <GridItem>
                <InputControl
                  name={fieldNames.SALE_START}
                  label="Sale Start"
                  control={control}
                  inputProps={{type: "datetime-local"}}
                  validationSchema={validationSchema}
                />
              
              <GridItem>
                <InputControl
                  name={fieldNames.SALE_END}
                  label="Sale End"
                  control={control}
                  inputProps={{type: "datetime-local"}}
                  validationSchema={validationSchema}
                />
              
            </Grid>
          
        </Grid> */
}
