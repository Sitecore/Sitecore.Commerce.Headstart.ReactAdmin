import {NumberInputControl} from "@/components/react-hook-form"
import {InfoOutlineIcon} from "@chakra-ui/icons"
import {Flex, Button, FormControl, FormErrorMessage, Text, Box} from "@chakra-ui/react"
import {useErrorToast} from "hooks/useToast"
import {get} from "lodash"
import {Control, UseFormTrigger, useFieldArray, useFormState} from "react-hook-form"
import {validationSchema} from "../form-meta"
import {OverridePriceScheduleFieldValues} from "types/form/OverridePriceScheduleFieldValues"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"

interface PriceBreakTableProps {
  control: Control<OverridePriceScheduleFieldValues>
  trigger: UseFormTrigger<any>
  fieldNamePrefix: string
}
export function PriceBreakTable({control, trigger, fieldNamePrefix}: PriceBreakTableProps) {
  const {fields, append, remove} = useFieldArray({
    control,
    name: withPrefix("PriceBreaks") as any
  })
  const {errors} = useFormState({control})
  const errorMessage = getPricebreakErrorMessage(errors)
  const errorToast = useErrorToast()
  const isProductManager = useHasAccess(appPermissions.ProductManager)

  const handleDeletePriceBreak = (index: number) => {
    remove(index)
  }

  const handleAddPriceBreak = async () => {
    const isValid = await trigger(withPrefix("PriceBreaks"))
    if (!isValid) {
      errorToast({description: "Please resolve errors before adding a new price break"})
      return
    }
    append({Quantity: "", Price: "", SalePrice: "", SubscriptionPrice: ""})
  }

  function getPricebreakErrorMessage(errors: any) {
    const error = get(errors, withPrefix("PriceBreaks"), "") as any
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
            name={`${withPrefix("PriceBreaks")}.${index}.Quantity`}
            label="Quantity"
            control={control}
            validationSchema={validationSchema}
            isDisabled={!isProductManager}
          />
          <NumberInputControl
            numberInputProps={{flexGrow: 1}}
            name={`${withPrefix("PriceBreaks")}.${index}.Price`}
            label="Price (per unit)"
            control={control}
            leftAddon="$"
            validationSchema={validationSchema}
            isDisabled={!isProductManager}
          />
          <NumberInputControl
            numberInputProps={{flexGrow: 1}}
            name={`${withPrefix("PriceBreaks")}.${index}.SalePrice`}
            label="Sale Price (per unit)"
            control={control}
            leftAddon="$"
            validationSchema={validationSchema}
            isDisabled={!isProductManager}
          />
          <NumberInputControl
            numberInputProps={{flexGrow: 1}}
            name={`${withPrefix("PriceBreaks")}.${index}.SubscriptionPrice`}
            label="Subscription Price (per unit)"
            control={control}
            leftAddon="$"
            validationSchema={validationSchema}
            isDisabled={!isProductManager}
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
      {isProductManager && (
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
      )}
    </Box>
  )
}
