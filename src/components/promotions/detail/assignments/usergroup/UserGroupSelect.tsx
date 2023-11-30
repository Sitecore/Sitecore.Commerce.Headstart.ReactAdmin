import {Button, HStack, VStack} from "@chakra-ui/react"
import {Select, AsyncSelect} from "chakra-react-select"
import {debounce} from "lodash"
import {Buyers, PromotionAssignment, UserGroups} from "ordercloud-javascript-sdk"
import {useEffect, useMemo, useState} from "react"
import {ReactSelectOption} from "types/form/ReactSelectOption"
import {IBuyer} from "types/ordercloud/IBuyer"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"

interface UserGroupSelectProps {
  onUpdate: (usergroupSelections: PromotionAssignment[]) => void
  existingAssignments: PromotionAssignment[]
}

export function UserGroupSelect({onUpdate, existingAssignments}: UserGroupSelectProps) {
  const [buyer, setBuyer] = useState<{ID: string; Name: string}>()
  const [usergroupSelections, setUserGroupSelections] = useState<PromotionAssignment[]>([])
  const [selectValue, setSelectValue] = useState<ReactSelectOption[]>([])
  const [inputValue, setInputValue] = useState("")
  const [options, setOptions] = useState<ReactSelectOption[]>([])
  const [loading, setLoading] = useState(false)

  const loadUserGroups = useMemo(
    () =>
      debounce(async () => {
        try {
          if (!buyer) return
          setLoading(true)
          const existingUserGroupIds = existingAssignments
            .filter((ass) => ass.BuyerID === buyer.ID)
            .map((ass) => ass.UserGroupID)
          const allUserGroups = await UserGroups.List<IBuyerUserGroup>(buyer.ID, {
            search: inputValue,
            pageSize: 5,
            filters: {ID: existingUserGroupIds.map((id) => `!${id}`)}
          })
          setOptions(
            allUserGroups.Items.map((usergroup) => ({
              label: `${buyer.Name} | ${usergroup.Name}`,
              // react-hook-form only allows us to store one value as the select value
              // but we need both buyer, and usergroup ID to ensure uniqueness
              // so we store both IDs in the value property, and parse them out later
              // this is safe because | is not a valid character in an ID
              value: `${buyer.ID}|${usergroup.ID}`
            }))
          )
        } finally {
          setLoading(false)
        }
      }, 500),
    [inputValue, buyer, existingAssignments]
  )

  useEffect(() => {
    loadUserGroups()
  }, [loadUserGroups])

  const handleUserGroupSelect = (options: ReactSelectOption[]) => {
    setSelectValue(options)
    setUserGroupSelections(
      options.map((option) => {
        const idParts = option.value.split("|")
        return {BuyerID: idParts[0], UserGroupID: idParts[1]}
      })
    )
  }

  const handleBuyerUpdate = (buyer: {ID: string; Name: string}) => {
    setBuyer(buyer)
  }

  const handleAdd = () => {
    onUpdate(usergroupSelections)
    setSelectValue([])
  }

  return (
    <HStack>
      <BuyerSelect onUpdate={handleBuyerUpdate} />
      <Select
        isMulti
        value={selectValue}
        inputValue={inputValue}
        options={options}
        isLoading={loading}
        placeholder="Select usergroup..."
        onInputChange={setInputValue}
        onChange={handleUserGroupSelect}
        isClearable={false}
        colorScheme="accent"
        chakraStyles={{
          container: (baseStyles) => ({...baseStyles, minWidth: 400})
        }}
      />
      <Button variant="outline" colorScheme="accent" onClick={handleAdd} isDisabled={!usergroupSelections.length}>
        Add
      </Button>
    </HStack>
  )
}

interface BuyerSelectProps {
  onUpdate: ({ID, Name}: {ID: string; Name: string}) => void
}
function BuyerSelect({onUpdate}: BuyerSelectProps) {
  const loadBuyers = async (inputValue: string) => {
    const allBuyers = await Buyers.List<IBuyer>({
      search: inputValue,
      pageSize: 5,
      filters: {UserGroupCount: ">0"}
    })
    return allBuyers.Items.map((buyer) => ({label: buyer.Name, value: buyer.ID}))
  }
  return (
    <AsyncSelect
      loadOptions={loadBuyers}
      defaultOptions
      isMulti={false}
      colorScheme="accent"
      placeholder="Select buyer..."
      onChange={(option) => onUpdate({ID: option.value, Name: option.label})}
      chakraStyles={{
        container: (baseStyles) => ({...baseStyles, minWidth: 400})
      }}
    />
  )
}
