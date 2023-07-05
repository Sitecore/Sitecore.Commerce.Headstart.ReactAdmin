import SubmitButton from "@/components/react-hook-form/submit-button"
import {
  Button,
  ButtonGroup,
  FormErrorMessage,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  FormControl as ChakraFormControl
} from "@chakra-ui/react"
import {useForm, useFormState} from "react-hook-form"
import {FormEvent, useCallback, useState} from "react"
import {Catalog, Catalogs} from "ordercloud-javascript-sdk"
import {compact, uniq} from "lodash"
import {TbX} from "react-icons/tb"
import {SelectControl} from "@/components/react-hook-form"
import {ProductCatalogAssignmentFieldValues} from "types/form/ProductCatalogAssignmentFieldValues"

interface CatalogAssignmentModalContentProps {
  catalogs: ProductCatalogAssignmentFieldValues[]
  onUpdate: (data: ProductCatalogAssignmentFieldValues[]) => void
  onRemove: (index: number) => void
  onCancelModal: () => void
  product?: string
}
export function CatalogAssignmentModalContent({
  catalogs = [],
  onUpdate,
  onRemove,
  onCancelModal,
  product
}: CatalogAssignmentModalContentProps) {
  const {handleSubmit, control, reset} = useForm({
    mode: "onBlur",
    defaultValues: getAsyncDefaultValues as any
  })

  const {errors} = useFormState({control})
  const [catalogList, setCatalogList] = useState<Catalog[]>([])

  async function getAsyncDefaultValues() {
    // get catalog assignments data
    const catalogAssignments = catalogs.filter((assignment) => !assignment.CatalogID)
    const allCatalogIds = uniq(compact(catalogAssignments.map((assignment) => assignment.CatalogID)))
    if (!allCatalogIds.length) {
      return {CatalogAssignments: []}
    }
    const allCatalogs = await Catalogs.List({filters: {ID: allCatalogIds.join("|")}})

    const response = {
      CatalogAssignments: catalogAssignments.map((assignment) => {
        const catalog = allCatalogs.Items.find((catalog) => catalog.ID === assignment.CatalogID)
        return {label: catalog.Name, value: catalog.ID}
      })
    }
    return response
  }

  const onSubmit = (data) => {
    const catalogAssignments = data.CatalogAssignments.map((optionValue) => {
      const selectedCatalog = catalogList.find((cat) => cat.ID === optionValue)
      return {
        CatalogID: optionValue,
        CatalogName: selectedCatalog.Name,
        ProductID: product
      }
    })
    onUpdate([...catalogAssignments])
  }

  const handleSubmitPreventBubbling = (event: FormEvent) => {
    // a version of handleSubmit that prevents
    // the parent form from being submitted
    // which would actually try to save the product (not desired)
    event.preventDefault()
    event.stopPropagation()
    handleSubmit(onSubmit)(event)
  }

  const handleCancel = () => {
    onCancelModal()
    reset()
  }

  const loadCatalogs = useCallback(async (search: string) => {
    const allCatalogs = await Catalogs.List({search})
    setCatalogList(allCatalogs.Items)
    return allCatalogs.Items.map((catalog) => ({label: <CatalogLabel catalog={catalog} />, value: catalog.ID}))
  }, [])

  const handleRemove = (index: number) => {
    onRemove(index)
  }

  return (
    <ModalContent as="form" noValidate onSubmit={handleSubmitPreventBubbling}>
      <ModalHeader>Assign Catalog</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <SelectControl
          name="CatalogAssignments"
          label="Assign to catalogs"
          control={control}
          maxWidth="50%"
          selectProps={{
            isMulti: true,
            loadOptions: loadCatalogs,
            chakraStyles: {
              container: (baseStyles) => ({...baseStyles, marginBottom: 5}),
              multiValueLabel: (baseStyles) => ({...baseStyles, backgroundColor: "transparent"}),
              multiValue: (baseStyles) => ({...baseStyles, backgroundColor: "transparent"})
            }
          }}
        />
        <ButtonGroup display="flex" flexWrap="wrap" gap={2} marginTop={2}>
            {(Array.isArray(catalogs) ? catalogs : []).map((option, index) => (
            <Button
                key={index}
                rightIcon={<TbX />}
                variant="solid"
                fontWeight={"normal"}
                size="sm"
                borderRadius={"full"}
                onClick={() => handleRemove(index)}
                backgroundColor="accent.100"
                style={{margin: 0}}
            >
                {option.CatalogName}
            </Button>
            ))}
        </ButtonGroup>
      </ModalBody>
      <ModalFooter>
        <HStack justifyContent="space-between" w="100%">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <HStack>
            {/* Display top level (multi-field) errors */}
            {errors && Boolean(errors[""]) && (
              <ChakraFormControl isInvalid={true}>
                <FormErrorMessage>{(errors as any)[""].message}</FormErrorMessage>
              </ChakraFormControl>
            )}
            <SubmitButton control={control} variant="solid" colorScheme="primary">
              Save changes
            </SubmitButton>
          </HStack>
        </HStack>
      </ModalFooter>
    </ModalContent>
  )
}

function CatalogLabel({catalog}: {catalog: Catalog}) {
  return (
    <Button
      variant="solid"
      fontWeight={"normal"}
      size="sm"
      borderRadius={"full"}
      backgroundColor="primary.100"
      style={{margin: 0}}
    >
      <Text>{catalog.Name} </Text>
    </Button>
  )
}
