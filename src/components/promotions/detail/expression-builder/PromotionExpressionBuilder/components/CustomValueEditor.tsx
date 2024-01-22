import {ValueEditorProps} from "react-querybuilder"
import {ChakraValueEditor} from "@react-querybuilder/chakra"
import {SearchableField, hasSearchableField, getModelName} from "./SearchableField/SearchableField"
import {NumberInputField} from "./NumberInputField"
import {BooleanInputField} from "./BooleanInputField"
import {CreatableInputField} from "./CreatableInputField"
import useHasAccess from "@/hooks/useHasAccess"

interface CustomValueEditorProps extends ValueEditorProps {
  showInModal?: boolean
  handleOnParentChange?: (value: string) => void
}
export function CustomValueEditor(props: CustomValueEditorProps) {
  const modelName = getModelName(props)
  const hasReaderRole = useHasAccess(`${modelName}Reader`)
  const hasAdminRole = useHasAccess(`${modelName}Admin`)
  const hasAccess = hasReaderRole || hasAdminRole
  if (props.operator === "in") {
    return <CreatableInputField {...props} />
  }

  if (hasSearchableField(props) && hasAccess) {
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
