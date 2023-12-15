import {ValueEditorProps} from "react-querybuilder"
import {ChakraValueEditor} from "@react-querybuilder/chakra"
import {SearchableField, hasSearchableField} from "./SearchableField/SearchableField"
import {NumberInputField} from "./NumberInputField"
import {BooleanInputField} from "./BooleanInputField"
import {CreatableInputField} from "./CreatableInputField"

interface CustomValueEditorProps extends ValueEditorProps {
  showInModal?: boolean
  handleOnParentChange?: (value: string) => void
}
export function CustomValueEditor(props: CustomValueEditorProps) {
  if (props.operator === "in") {
    return <CreatableInputField {...props} />
  }

  if (hasSearchableField(props)) {
    return <SearchableField {...props} />
  }

  if (props.inputType === "number" || props.operator === "containsNumber") {
    return <NumberInputField {...props} />
  }
  if (props.type === "checkbox") {
    return <BooleanInputField {...props} />
  }
  return <ChakraValueEditor {...props} disabled={props.context?.isDisabled} />
}
