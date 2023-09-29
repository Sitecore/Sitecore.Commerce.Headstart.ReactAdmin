import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Select,
  Tooltip,
  Text
} from "@chakra-ui/react"
import {usePromoExpressions} from "hooks/usePromoExpressions"
import {ActionWithRulesAndAddersProps, RuleGroupType, update} from "react-querybuilder"
import {ChangeEvent, MouseEvent, useMemo} from "react"
import {InfoOutlineIcon} from "@chakra-ui/icons"
import {getValidationMessage, isInvalid} from "../validator"
import {groupOperators} from "../groupOperators"

export function CustomAddRuleAction({
  label,
  handleOnClick,
  path,
  context,
  ruleOrGroup,
  validation
}: ActionWithRulesAndAddersProps) {
  const {options} = usePromoExpressions()

  const handleMenuClick = (modelName: string, modelPath: string) => (e: MouseEvent) => {
    // we're passing modelPath as context, then in onAddRule we will use that context to add it to the rule
    // this will allow us to filter the options based on the selected model
    handleOnClick(e, {modelName, modelPath})
  }

  const updateGroup = (e: ChangeEvent<HTMLSelectElement>) => {
    let updatedQuery: any
    const operator = e.target.value
    const wasPreviouslyMinOrMax = ruleOrGroup["operator"] === "min" || ruleOrGroup["operator"] === "max"
    const willBeMinOrMax = operator === "min" || operator === "max"
    const combinatorIndices = (ruleOrGroup as RuleGroupType).rules
      .map((r, index) => {
        if (typeof r === "string") {
          return index
        }
      })
      .filter((i) => i !== undefined)

    // Update group with new function
    updatedQuery = update(context.query, "operator", operator, path)

    // if operator is min/max then update combinators to be COMMA
    if (willBeMinOrMax) {
      combinatorIndices.forEach((combinatorIndex) => {
        updatedQuery = update(updatedQuery, "combinator", ",", [...path, combinatorIndex])
      })
    }
    // if operator was previously min/max and is now something else then update combinators to be AND
    else if (wasPreviouslyMinOrMax && !willBeMinOrMax) {
      combinatorIndices.forEach((combinatorIndex) => {
        updatedQuery = update(updatedQuery, "combinator", "and", [...path, combinatorIndex])
      })
    }

    context.handleQueryChange(updatedQuery)
  }

  const isAddRuleDisabled = useMemo(() => {
    const isMinOrMax = ruleOrGroup["operator"] === "min" || ruleOrGroup["operator"] === "max"
    // Max number of rules is 2 for min/max
    // Note: combinators are considered rules, thats why we are checking 3 instead of 2
    const result = isMinOrMax && (ruleOrGroup as RuleGroupType)?.rules?.length >= 3

    return result
  }, [ruleOrGroup])

  return (
    <HStack justifyContent="space-between" width="full">
      <HStack>
        <Select onChange={updateGroup}>
          <option value=""></option>
          {groupOperators.map((o) => (
            <option key={o.name} value={o.name}>
              {o.label}
            </option>
          ))}
        </Select>
        <Tooltip
          label={
            groupOperators.find((o) => o.name === ruleOrGroup["operator"])?.description ||
            "Optionally apply an operator to all the rules in the group"
          }
          placement="right"
          aria-label={`Tooltip for group operator ${ruleOrGroup["operator"]}`}
        >
          <InfoOutlineIcon fontSize="sm" color="gray.600" />
        </Tooltip>
        {isInvalid(validation) && (
          <Text color="red" whiteSpace="nowrap">
            {getValidationMessage(validation)}
          </Text>
        )}
      </HStack>
      <Menu placement="right-end">
        <MenuButton
          as={Button}
          isDisabled={isAddRuleDisabled}
          title={isAddRuleDisabled ? "Min/Max can compare up to two expressions" : "Add a new rule"}
          aria-label={isAddRuleDisabled ? "Min/Max can compare up to two expressions" : "Add a new rule"}
        >
          {label} {isAddRuleDisabled}
        </MenuButton>
        <MenuList>
          <MenuOptionGroup title="Add rule for">
            {options.map((option) => (
              <MenuItemOption
                key={option.value}
                icon={<></>}
                iconSpacing={0}
                value={option.value}
                onClick={handleMenuClick(option.label, option.value)}
              >
                {option.label}
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </HStack>
  )
}
