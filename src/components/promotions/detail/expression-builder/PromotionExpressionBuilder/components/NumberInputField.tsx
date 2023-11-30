import {Input} from "@chakra-ui/react"
import {ChangeEvent} from "react"
import {ValueEditorProps} from "react-querybuilder"

// This NumberInputField must be used so that it parses the value as a number instead of as a stringified number
export const NumberInputField = (props: ValueEditorProps) => {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const numberValue = Number(value)
    const result = Number.isNaN(numberValue) ? "" : numberValue
    props.handleOnChange(result)
  }

  return <Input type="number" value={props.value} onChange={handleOnChange} isDisabled={props.context?.isDisabled} />
}
