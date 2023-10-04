import {DragHandleIcon, InfoOutlineIcon} from "@chakra-ui/icons"
import {
  Flex,
  TableContainer,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  FormControl as ChakraFormControl,
  FormErrorMessage,
  Button
} from "@chakra-ui/react"
import {useErrorToast} from "hooks/useToast"
import {get} from "lodash"
import {Control, UseFormTrigger, useFieldArray, useFormState, useWatch} from "react-hook-form"
import {specFormDefaultValues} from "./SpecUpdateModal"
import {SpecFieldValues} from "types/form/SpecFieldValues"
import {InputControl, SelectControl} from "@/components/react-hook-form"

interface SpecOptionTableProps {
  control: Control<SpecFieldValues>
  validationSchema: any
  trigger: UseFormTrigger<any>
}
export function SpecOptionTable({control, validationSchema, trigger}: SpecOptionTableProps) {
  const {
    fields: options,
    append,
    remove
  } = useFieldArray({
    control,
    name: "Options"
  })
  const {errors} = useFormState({control, name: "Options"})
  const errorMessage = getOptionsErrorMessage(errors)
  const errorToast = useErrorToast()

  const handleDeleteOption = (index: number) => {
    remove(index)
  }

  const handleAddOption = async () => {
    const isValid = await trigger("Options")
    if (!isValid) {
      errorToast({description: "Please resolve errors before adding a new option"})
      return
    }
    append(specFormDefaultValues.Options[0])
  }

  function getOptionsErrorMessage(errors: any) {
    const error = get(errors, "Options", "") as any
    if (error.message) {
      // error on options array as a whole, individual option messages will be reported on the inputs
      return error.message
    } else {
      return ""
    }
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault()
      handleAddOption()
    }
  }

  const tableCellPadding = 1

  return (
    <>
      <TableContainer width="full">
        <Table>
          <Thead>
            <Tr>
              <Th padding={tableCellPadding}>Options</Th>
              <Th padding={tableCellPadding}>Markup Type</Th>
              <Th padding={tableCellPadding}>Markup</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {options.map((option, index) => {
              return (
                <Tr key={option.id || option.Value || index}>
                  <Td padding={tableCellPadding}>
                    <InputControl
                      name={`Options.${index}.Value`}
                      control={control}
                      validationSchema={validationSchema}
                      inputProps={{onKeyPress: handleKeyPress}}
                    />
                  </Td>
                  <Td padding={tableCellPadding}>
                    <SelectControl
                      name={`Options.${index}.PriceMarkupType`}
                      control={control}
                      validationSchema={validationSchema}
                      selectProps={{
                        options: [
                          {label: "None", value: "NoMarkup"},
                          {label: "Percentage", value: "Percentage"},
                          {label: "Amount per quantity", value: "AmountPerQuantity"},
                          {label: "Amount total", value: "AmountTotal"}
                        ]
                      }}
                    />
                  </Td>
                  <Td padding={tableCellPadding}>
                    <PriceMarkupControl
                      index={index}
                      control={control}
                      validationSchema={validationSchema}
                      onKeyPress={handleKeyPress}
                    />
                  </Td>
                  <Td
                    _hover={{cursor: "pointer"}}
                    onClick={() => handleDeleteOption(index)}
                    padding={tableCellPadding}
                    textAlign="right"
                  >
                    <Button variant="link" colorScheme="danger">
                      Delete
                    </Button>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex width="full" justifyContent="space-between" alignContent="center" marginTop={2}>
        <Button variant="link" color="accent.400" maxWidth="max-content" onClick={handleAddOption}>
          Add option
        </Button>
        <ChakraFormControl isInvalid={errorMessage} maxWidth="max-content">
          <FormErrorMessage display="inline-block">
            <InfoOutlineIcon mr={2} /> {errorMessage}
          </FormErrorMessage>
        </ChakraFormControl>
      </Flex>
    </>
  )
}

interface PriceMarkupControlProps {
  control: Control<SpecFieldValues>
  validationSchema: any
  index: number
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}
// Isolating this component to limit rerenders caused by useWatch (best practice)
function PriceMarkupControl({control, validationSchema, index, onKeyPress}: PriceMarkupControlProps) {
  const markupType = useWatch({
    control,
    name: `Options.${index}.MarkupType`
  })

  const isDisabled = markupType === "NoMarkup"
  const leftAddon = markupType === "AmountTotal" ? "$" : null
  const rightAddon = markupType === "Percentage" ? "%" : null

  return (
    <InputControl
      inputProps={{isDisabled, onKeyPress}}
      leftAddon={leftAddon}
      rightAddon={rightAddon}
      name={`Options.${index}.PriceMarkup`}
      control={control}
      validationSchema={validationSchema}
    />
  )
}
