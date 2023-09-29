import {ValueEditorProps} from "react-querybuilder"
import {ChakraValueEditor} from "@react-querybuilder/chakra"
import {SearchableIdField, hasSearchableIdField} from "./SearchableIdField"
import {NumberInputField} from "./NumberInputField"
import {BooleanInputField} from "./BooleanInputField"

export function CustomValueEditor(props: ValueEditorProps) {
  if (hasSearchableIdField(props)) {
    return <SearchableIdField {...props} />
  }

  if (props.inputType === "number") {
    return <NumberInputField {...props} />
  }
  if (props.type === "checkbox") {
    return <BooleanInputField {...props} />
  }
  return <ChakraValueEditor {...props} />
}
