import SubmitButton from "@/components/react-hook-form/submit-button"
import {
  Button,
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
import {Catalog, Catalogs, ProductCatalogAssignment} from "ordercloud-javascript-sdk"
import {SelectControl} from "@/components/react-hook-form"
interface CatalogAssignmentModalContentProps {
  catalogAssignments: ProductCatalogAssignment[]
  onUpdate: (data: ProductCatalogAssignment[]) => void
  onCancelModal: () => void
}
export function CatalogAssignmentModalContent({
  catalogAssignments = [],
  onUpdate,
  onCancelModal
}: CatalogAssignmentModalContentProps) {
  const {handleSubmit, control, reset} = useForm({
    mode: "onBlur",
    defaultValues: {CatalogAssignments: catalogAssignments.map((assignment) => assignment.CatalogID)} as any
  })

  const {errors} = useFormState({control})
  const [catalogList, setCatalogList] = useState<Catalog[]>([])

  const onSubmit = (data) => {
    const catalogAssignments = data.CatalogAssignments.map((catalogId) => {
      const selectedCatalog = catalogList.find((cat) => cat.ID === catalogId)
      return {
        CatalogID: catalogId,
        CatalogName: selectedCatalog.Name
      }
    })
    onUpdate(catalogAssignments)
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

  return (
    <ModalContent as="form" noValidate onSubmit={handleSubmitPreventBubbling}>
      <ModalHeader>Assign to catalog</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <SelectControl
          name="CatalogAssignments"
          label=""
          control={control}
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
