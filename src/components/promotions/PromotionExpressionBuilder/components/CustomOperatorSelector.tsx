import {Select} from "@chakra-ui/react"
import {OperatorSelectorProps, findPath, getParentPath} from "react-querybuilder"

export function CustomOperatorSelector({className, value, handleOnChange, options, rule}: OperatorSelectorProps) {
  if (!rule["modelPath"]) {
    // This is a raw value, so we don't need to show the operator selector
    return
  }
  return (
    <Select className={className} value={value} onChange={(e) => handleOnChange(e.target.value)}>
      {(options as any)
        .filter((o) => o.label !== "COMMA") // comma is used for min/max but should not be visible in the UI
        .map((option) => (
          <option key={option["name"]} value={option["name"]}>
            {option.label}
          </option>
        ))}
    </Select>
  )
}
