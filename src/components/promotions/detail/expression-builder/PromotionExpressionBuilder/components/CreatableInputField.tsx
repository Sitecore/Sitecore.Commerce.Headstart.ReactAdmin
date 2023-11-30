import {ValueEditorProps} from "react-querybuilder"
import {CreatableSelect, MultiValue} from "chakra-react-select"
import {ReactSelectOption} from "types/form/ReactSelectOption"

export const CreatableInputField = (props: ValueEditorProps) => {
  const handleOnChange = (options: MultiValue<ReactSelectOption>) => {
    const stringified = options.map((o) => o.value).join(",")
    props.handleOnChange(stringified)
  }

  return (
    <CreatableSelect<ReactSelectOption, true>
      value={props?.value
        .split(",")
        .filter((v) => !!v) // exclude empty strings
        .map((v) => ({label: v, value: v}))}
      isMulti={true}
      noOptionsMessage={() => "Start typing to create option"}
      placeholder="Start typing to create option"
      isDisabled={props.context?.isDisabled}
      onChange={handleOnChange}
      chakraStyles={{
        container: (baseStyles) => ({...baseStyles, minWidth: "300px"})
      }}
    />
  )
}
