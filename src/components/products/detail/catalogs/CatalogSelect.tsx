import {Button, HStack} from "@chakra-ui/react"
import {Select} from "chakra-react-select"
import {debounce} from "lodash"
import {Catalogs, ProductCatalogAssignment} from "ordercloud-javascript-sdk"
import {useEffect, useMemo, useState} from "react"
import {ReactSelectOption} from "types/form/ReactSelectOption"
import {ICatalog} from "types/ordercloud/ICatalog"

interface CatalogSelectProps {
  onUpdate: (catalogIds: string[]) => void
  existingAssignments: ProductCatalogAssignment[]
}
export function CatalogSelect({onUpdate, existingAssignments}: CatalogSelectProps) {
  const [catalogIds, setCatalogIds] = useState<string[]>([])
  const [selectValue, setSelectValue] = useState<ReactSelectOption[]>([])
  const [inputValue, setInputValue] = useState("")
  const [options, setOptions] = useState<ReactSelectOption[]>([])
  const [loading, setLoading] = useState(false)

  const loadCatalogs = useMemo(
    () =>
      debounce(async () => {
        try {
          setLoading(true)
          const existingCatalogIds = existingAssignments.map((assignment) => assignment.CatalogID)
          const allCatalogs = await Catalogs.List<ICatalog>({
            search: inputValue,
            pageSize: 5,
            filters: {ID: existingCatalogIds.map((id) => `!${id}`)}
          })
          setOptions(allCatalogs.Items.map((catalog) => ({label: catalog.Name, value: catalog.ID})))
        } finally {
          setLoading(false)
        }
      }, 500),
    [inputValue, existingAssignments]
  )

  useEffect(() => {
    loadCatalogs()
  }, [loadCatalogs])

  const handleCategorySelect = (options: ReactSelectOption[]) => {
    setSelectValue(options)
    setCatalogIds(options.map((option) => option.value))
  }

  const handleAdd = () => {
    onUpdate(catalogIds)
    setSelectValue([])
  }

  return (
    <HStack maxWidth="900px">
      <Select
        isMulti
        value={selectValue}
        inputValue={inputValue}
        options={options}
        isLoading={loading}
        onInputChange={setInputValue}
        onChange={handleCategorySelect}
        isClearable={false}
        colorScheme="primary"
        chakraStyles={{
          container: (baseStyles) => ({...baseStyles, minWidth: "400px"})
        }}
      />
      <Button variant="outline" colorScheme="primary" onClick={handleAdd} isDisabled={!catalogIds.length}>
        Add
      </Button>
    </HStack>
  )
}
