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
import {useController, useForm, useFormState} from "react-hook-form"
import {FormEvent, useCallback, useState} from "react"
import {Categories, Catalogs} from "ordercloud-javascript-sdk"
import {compact, debounce, rest, uniq, uniqWith} from "lodash"
import {TbX} from "react-icons/tb"
import {FormControl} from "@/components/react-hook-form"
import {object, string, array} from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import {ICategoryProductAssignment} from "types/ordercloud/ICategoryProductAssignment"
import {AsyncSelect, Select} from "chakra-react-select"
import {isRequiredField} from "utils"

interface CategoryAssignmentModalContentProps {
  categoryAssignments: ICategoryProductAssignment[]
  onUpdate: (data: ICategoryProductAssignment[]) => void
  onCancelModal: () => void
}
export function CategoryAssignmentModalContent({
  categoryAssignments = [],
  onUpdate,
  onCancelModal
}: CategoryAssignmentModalContentProps) {
  const [currentCatalog, setCurrentCatalog] = useState({label: "", value: ""})
  const [categoryOptions, setCategoryOptions] = useState<{label: string; value: string}[]>([])
  const [isLoadingCategoryOptions, setIsLoadingCategoryOptions] = useState(false)
  const selectOptionSchemaRequired = object().shape({label: string().required(), value: string().required()})

  const validationSchema = object().shape({
    CategoryAssignments: array()
      .of(
        object().shape({
          Catalog: selectOptionSchemaRequired,
          Category: selectOptionSchemaRequired
        })
      )
      .test("unique-category-assignment", "Category assignment must be unique", (assignments = []) => {
        return (
          compact(
            uniqWith(
              assignments,
              (a, b) => a.Catalog.value === b.Catalog.value && a.Category.value === b.Category.value
            )
          ).length === assignments.length
        )
      })
  })

  const {handleSubmit, control, reset} = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: getAsyncDefaultValues as any
  })

  const {
    field,
    formState: {isSubmitting}
  } = useController({
    name: "CategoryAssignments",
    control
  })

  const {errors} = useFormState({control})

  async function getAsyncDefaultValues() {
    // get catalogs (so we can set display)
    const allCatalogIds = uniq(compact(categoryAssignments.map((assignment) => assignment.CatalogID)))
    const allCatalogs = allCatalogIds.length
      ? (await Catalogs.List({filters: {ID: allCatalogIds.join("|")}})).Items
      : []

    // get categories (so we can set display)
    const allCategoryRequests = categoryAssignments.map(async (assignment) => {
      const catalog = allCatalogs.find((cat) => cat.ID === assignment.CatalogID)
      const category = await Categories.Get(assignment.CatalogID, assignment.CategoryID)
      return {
        Catalog: {label: catalog?.Name, value: catalog?.ID},
        Category: {label: category.Name, value: category.ID}
      }
    })

    return {
      CategoryAssignments: await Promise.all(allCategoryRequests)
    }
  }

  const onSubmit = (data) => {
    const assignments = data.CategoryAssignments.map((option) => ({
      CategoryID: option.Category.value,
      CatalogID: option.Catalog.value
    })) as ICategoryProductAssignment[]
    onUpdate(assignments)
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
    const allCatalogs = await Catalogs.List({search, filters: {CategoryCount: ">0"}})
    return allCatalogs.Items.map((category) => ({label: category.Name, value: category.ID}))
  }, [])

  const handleCatalogChange = (newCatalog) => {
    setCurrentCatalog(newCatalog)
    loadCategories("", newCatalog.value)
  }

  const loadCategories = async (search: string, catalogId?: string) => {
    try {
      setIsLoadingCategoryOptions(true)
      if (!catalogId && !currentCatalog.value) return []
      const categories = await Categories.List(catalogId || currentCatalog.value, {
        search,
        depth: "all"
      })
      const options = categories.Items.filter((category) => {
        const alreadyAssigned = (field.value || []).some((assignment) => assignment.Category.value === category.ID)
        return !alreadyAssigned
      }).map((category) => ({label: category.Name, value: category.ID}))
      setCategoryOptions(options)
    } finally {
      setIsLoadingCategoryOptions(false)
    }
  }

  const isRequired = isRequiredField(validationSchema, field.name)

  const handleRemove = (index: number) => {
    const update = field.value.filter((value, i) => i !== index)
    field.onChange(update)
  }

  const debouncedLoadCategories = debounce(loadCategories, 500)

  const handleCategoryInputChange = (searchTerm) => {
    debouncedLoadCategories(searchTerm)
  }

  const handleCategoryChange = async (newCategory) => {
    field.onChange([...(field.value || []), {Catalog: currentCatalog, Category: newCategory}])
  }

  return (
    <ModalContent as="form" noValidate onSubmit={handleSubmitPreventBubbling}>
      <ModalHeader>Assign Category</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl name={"CategoryAssignments"} control={control} label={""} isRequired={isRequired} {...rest}>
          <HStack>
            <AsyncSelect
              chakraStyles={{container: (baseStyles) => ({...baseStyles, width: "100%"})}}
              isDisabled={isSubmitting}
              placeholder="Select catalog"
              defaultOptions
              loadOptions={loadCatalogs}
              onChange={handleCatalogChange}
            />
            <Select
              chakraStyles={{
                container: (baseStyles) => ({...baseStyles, width: "100%"})
              }}
              options={categoryOptions}
              placeholder="Select categories in catalog"
              name={field.name}
              isDisabled={isSubmitting || !currentCatalog.value}
              onChange={handleCategoryChange}
              closeMenuOnSelect={true}
              onInputChange={handleCategoryInputChange}
              controlShouldRenderValue={false}
              isLoading={isLoadingCategoryOptions}
              hideSelectedOptions={true}
            ></Select>
          </HStack>
        </FormControl>
        <ButtonGroup display="flex" flexWrap="wrap" gap={2} marginTop={2}>
          {(Array.isArray(field.value) ? field.value : []).map((option, index) => (
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
              {option.Catalog.label} <Text marginX={3}>|</Text> {option.Category.label}
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
