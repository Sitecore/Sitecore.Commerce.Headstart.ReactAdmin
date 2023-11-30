import {Button, HStack} from "@chakra-ui/react"
import {Select, AsyncSelect} from "chakra-react-select"
import {debounce} from "lodash"
import {Catalogs, Categories} from "ordercloud-javascript-sdk"
import {useEffect, useMemo, useState} from "react"
import {ReactSelectOption} from "types/form/ReactSelectOption"
import {ICatalog} from "types/ordercloud/ICatalog"
import {ICategoryProductAssignment} from "types/ordercloud/ICategoryProductAssignment"
import {ICategory} from "types/ordercloud/ICategoryXp"

interface CategorySelectProps {
  onUpdate: (categorySelections: ICategoryProductAssignment[]) => void
  existingAssignments: ICategoryProductAssignment[]
}

export function CategorySelect({onUpdate, existingAssignments}: CategorySelectProps) {
  const [catalog, setCatalog] = useState<{ID: string; Name: string}>()
  const [categorySelections, setCategorySelections] = useState<ICategoryProductAssignment[]>([])
  const [selectValue, setSelectValue] = useState<ReactSelectOption[]>([])
  const [inputValue, setInputValue] = useState("")
  const [options, setOptions] = useState<ReactSelectOption[]>([])
  const [loading, setLoading] = useState(false)

  const loadCategories = useMemo(
    () =>
      debounce(async () => {
        try {
          if (!catalog) return
          setLoading(true)
          const existingCategoryIds = existingAssignments
            .filter((ass) => ass.CatalogID === catalog.ID)
            .map((ass) => ass.CategoryID)
          const allCategories = await Categories.List<ICategory>(catalog.ID, {
            search: inputValue,
            pageSize: 5,
            filters: {ID: existingCategoryIds.map((id) => `!${id}`)}
          })
          setOptions(
            allCategories.Items.map((category) => ({
              label: `${catalog.Name} | ${category.Name}`,
              // react-hook-form only allows us to store one value as the select value
              // but we need both catalog, and category ID to ensure uniqueness
              // so we store both IDs in the value property, and parse them out later
              // this is safe because | is not a valid character in an ID
              value: `${catalog.ID}|${category.ID}`
            }))
          )
        } finally {
          setLoading(false)
        }
      }, 500),
    [inputValue, catalog, existingAssignments]
  )

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const handleCategorySelect = (options: ReactSelectOption[]) => {
    setSelectValue(options)
    setCategorySelections(
      options.map((option) => {
        const idParts = option.value.split("|")
        return {CatalogID: idParts[0], CategoryID: idParts[1]}
      })
    )
  }

  const handleCatalogUpdate = (catalog: {ID: string; Name: string}) => {
    setCatalog(catalog)
  }

  const handleAdd = () => {
    onUpdate(categorySelections)
    setSelectValue([])
  }

  return (
    <HStack maxWidth="900px">
      <CatalogSelect onUpdate={handleCatalogUpdate} />
      <Select
        isMulti
        value={selectValue}
        inputValue={inputValue}
        options={options}
        isLoading={loading}
        onInputChange={setInputValue}
        onChange={handleCategorySelect}
        isClearable={false}
        colorScheme="accent"
        chakraStyles={{
          container: (baseStyles) => ({...baseStyles, minWidth: 400})
        }}
      />
      <Button variant="outline" colorScheme="accent" onClick={handleAdd} isDisabled={!categorySelections.length}>
        Add
      </Button>
    </HStack>
  )
}

interface CatalogSelectProps {
  onUpdate: ({ID, Name}: {ID: string; Name: string}) => void
}
function CatalogSelect({onUpdate}: CatalogSelectProps) {
  const loadCatalogs = async (inputValue: string) => {
    const allCatalogs = await Catalogs.List<ICatalog>({
      search: inputValue,
      pageSize: 5,
      filters: {CategoryCount: ">0"}
    })
    return allCatalogs.Items.map((catalog) => ({label: catalog.Name, value: catalog.ID}))
  }
  return (
    <AsyncSelect
      loadOptions={loadCatalogs}
      defaultOptions
      isMulti={false}
      colorScheme="accent"
      onChange={(option) => onUpdate({ID: option.value, Name: option.label})}
      chakraStyles={{
        container: (baseStyles) => ({...baseStyles, minWidth: 400})
      }}
    />
  )
}
