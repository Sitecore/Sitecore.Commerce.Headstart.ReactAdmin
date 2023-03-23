import {InputControl, NumberInputControl, SwitchControl} from "@/components/react-hook-form"
import {ChevronDownIcon, ChevronRightIcon, InfoOutlineIcon} from "@chakra-ui/icons"
import {Box, Button, Flex, FormControl, FormErrorMessage, Grid, GridItem, Text} from "@chakra-ui/react"
import {get} from "lodash"
import {PriceBreak} from "ordercloud-javascript-sdk"
import {useState} from "react"
import {Control, FieldValues, useFieldArray, useFormState} from "react-hook-form"
import {validationSchema} from "../meta"
import * as fieldNames from "./fieldNames"

const formInputGap = 5
const sectionGap = 10

interface PriceBreakTableProps {
  control: Control<FieldValues, any>
}
const PriceBreakTable = ({control}: PriceBreakTableProps) => {
  const {fields, append, remove} = useFieldArray({
    control,
    name: fieldNames.PRICE_BREAKS
  })
  const {errors} = useFormState({control})
  const error = get(errors, fieldNames.PRICE_BREAKS, "") as any

  const handleDeletePriceBreak = (index: number) => {
    remove(index)
  }

  const handleAddPriceBreak = () => {
    const lastPriceBreak = fields[fields.length - 1] as PriceBreak
    append({Quantity: lastPriceBreak.Quantity + 1, Price: "", SalePrice: ""})
  }

  return (
    <Box>
      <Text fontWeight="medium" marginBottom={3}>
        Volume Pricing
      </Text>
      {fields.map((field, index) => (
        <Flex key={field.id} gap={formInputGap} alignItems="end" flexWrap={{base: "wrap", lg: "nowrap"}}>
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
          {index !== 0 && (
            <Button variant="ghost" color="danger.500" onClick={() => handleDeletePriceBreak(index)}>
              Delete
            </Button>
          )}
        </Flex>
      ))}
      <Flex justifyContent="space-between">
        <Text fontWeight="medium" color="brand.400" maxWidth="max-content" onClick={handleAddPriceBreak}>
          Add price break
        </Text>
        <FormControl isInvalid={error} maxWidth="max-content">
          <FormErrorMessage display="inline-block">
            <InfoOutlineIcon mr={2} /> {error.message}
          </FormErrorMessage>
        </FormControl>
      </Flex>
    </Box>
  )
}

interface PricingFormProps {
  control: Control<FieldValues, any>
}
export function PricingForm({control}: PricingFormProps) {
  const [showAdvancedPricing, setShowAdvancedPricing] = useState(false)

  return (
    <>
      <Flex flexFlow="column" gap={sectionGap} maxWidth="1000px">
        <Grid templateColumns={{base: "1fr", xl: "1fr 1fr"}} gap={formInputGap}>
          <GridItem>
            <InputControl
              name={`${fieldNames.PRICE_BREAKS}.${0}.Price`}
              label="Regular Price (per unit)"
              control={control}
              leftAddon="$"
              validationSchema={validationSchema}
            />
          </GridItem>
          <GridItem gridRowStart={{base: "unset", xl: 2}}>
            <InputControl
              name={`${fieldNames.PRICE_BREAKS}.${0}.SalePrice`}
              label="Sale Price (per unit)"
              control={control}
              leftAddon="$"
              validationSchema={validationSchema}
            />
          </GridItem>
          <GridItem gridRowStart={{base: "unset", xl: 2}}>
            <Grid gap={formInputGap} gridTemplateColumns={{base: "1fr", xl: "1fr 1fr"}}>
              <GridItem>
                <InputControl
                  name={fieldNames.SALE_START}
                  label="Sale Start"
                  control={control}
                  inputProps={{type: "datetime-local"}}
                  validationSchema={validationSchema}
                />
              </GridItem>
              <GridItem>
                <InputControl
                  name={fieldNames.SALE_END}
                  label="Sale End"
                  control={control}
                  inputProps={{type: "datetime-local"}}
                  validationSchema={validationSchema}
                />
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
        <Text
          fontWeight="medium"
          maxWidth="max-content"
          onClick={() => setShowAdvancedPricing(showAdvancedPricing ? false : true)}
        >
          {showAdvancedPricing ? <ChevronDownIcon boxSize={6} /> : <ChevronRightIcon boxSize={6} />} Advanced Pricing
        </Text>
        {showAdvancedPricing && (
          <Flex flexFlow="column" gap={sectionGap}>
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
            <PriceBreakTable control={control} />
            <Box>
              <Text fontWeight="medium" marginBottom={3}>
                Order Limitations
              </Text>
              <Flex gap={formInputGap} flexWrap={{base: "wrap", lg: "nowrap"}}>
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
        )}
      </Flex>
    </>
  )
}
