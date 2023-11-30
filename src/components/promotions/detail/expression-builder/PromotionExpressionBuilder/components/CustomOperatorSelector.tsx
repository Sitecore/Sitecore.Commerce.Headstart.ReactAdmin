import {Select} from "chakra-react-select"
import {groupBy} from "lodash"
import {Operator, OperatorSelectorProps} from "react-querybuilder"
import {GroupedReactSelectOption, ReactSelectOption} from "types/form/ReactSelectOption"

export function CustomOperatorSelector({
  className,
  value,
  handleOnChange,
  options,
  rule,
  context
}: OperatorSelectorProps) {
  if (!rule["modelPath"]) {
    // This is a raw value, so we don't need to show the operator selector
    return
  }

  const selectOptions = groupOptions()

  function groupOptions() {
    const optionsWithoutComma = (options as Operator<string>[]).filter((o) => o.label !== "COMMA") // comma is used for min/max but should not be visible in the UI
    const grouped = Object.entries(groupBy(optionsWithoutComma, "group"))
    return grouped.reduce((acc, [groupName, group]) => {
      const groupOptions = group.map((o) => ({label: o.label, value: o["name"]}))
      acc.push({label: groupName, options: groupOptions})
      return acc
    }, [] as GroupedReactSelectOption[])
  }

  return (
    <Select<ReactSelectOption, false, GroupedReactSelectOption>
      className={className}
      isDisabled={options.length === 1 || context?.isDisabled}
      options={selectOptions}
      value={selectOptions.flatMap((o) => o.options).find((o) => o.value === value)}
      onChange={(selectedOption) => handleOnChange(selectedOption.value)}
      formatGroupLabel={(groupedOption) => groupedOption.label}
      chakraStyles={{
        container: (baseStyles) => ({...baseStyles, minWidth: "300px"})
      }}
    />
  )
}
