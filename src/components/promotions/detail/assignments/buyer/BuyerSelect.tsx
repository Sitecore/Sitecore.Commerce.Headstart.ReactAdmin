import {Button, HStack, VStack} from "@chakra-ui/react"
import {Select} from "chakra-react-select"
import {debounce} from "lodash"
import {Buyers, PromotionAssignment} from "ordercloud-javascript-sdk"
import {useEffect, useMemo, useState} from "react"
import {ReactSelectOption} from "types/form/ReactSelectOption"
import {IBuyer} from "types/ordercloud/IBuyer"

interface BuyerSelectProps {
  onUpdate: (buyerIds: string[]) => void
  existingAssignments: PromotionAssignment[]
}
export function BuyerSelect({onUpdate, existingAssignments}: BuyerSelectProps) {
  const [buyerIds, setBuyerIds] = useState<string[]>([])
  const [selectValue, setSelectValue] = useState<ReactSelectOption[]>([])
  const [inputValue, setInputValue] = useState("")
  const [options, setOptions] = useState<ReactSelectOption[]>([])
  const [loading, setLoading] = useState(false)

  const loadBuyers = useMemo(
    () =>
      debounce(async () => {
        try {
          setLoading(true)
          const existingBuyerIds = existingAssignments.map((assignment) => assignment.BuyerID)
          const allBuyers = await Buyers.List<IBuyer>({
            search: inputValue,
            pageSize: 5,
            filters: {ID: existingBuyerIds.map((id) => `!${id}`)}
          })
          setOptions(allBuyers.Items.map((buyer) => ({label: buyer.Name, value: buyer.ID})))
        } finally {
          setLoading(false)
        }
      }, 500),
    [inputValue, existingAssignments]
  )

  useEffect(() => {
    loadBuyers()
  }, [loadBuyers])

  const handleSelect = (options: ReactSelectOption[]) => {
    setSelectValue(options)
    setBuyerIds(options.map((option) => option.value))
  }

  const handleAdd = () => {
    onUpdate(buyerIds)
    setSelectValue([])
  }

  return (
    <HStack maxWidth="lg">
      <Select
        isMulti
        value={selectValue}
        inputValue={inputValue}
        options={options}
        isLoading={loading}
        onInputChange={setInputValue}
        placeholder="Select buyer..."
        onChange={handleSelect}
        isClearable={false}
        colorScheme="primary"
        chakraStyles={{
          container: (baseStyles) => ({...baseStyles, minWidth: "400px"})
        }}
      />
      <Button variant="outline" colorScheme="primary" onClick={handleAdd} isDisabled={!buyerIds.length}>
        Add
      </Button>
    </HStack>
  )
}
