import {Switch} from "@chakra-ui/react"
import {ValueEditorProps} from "react-querybuilder"

// Using switch component as an alternative to checkbox
export const BooleanInputField = (props: ValueEditorProps) => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.handleOnChange(event.target.checked)
  }
  return (
    <Switch
      size="lg"
      colorScheme="primary"
      marginBottom={1}
      isChecked={props.value}
      onChange={handleOnChange}
      isDisabled={props.context?.isDisabled}
    />
  )
}
