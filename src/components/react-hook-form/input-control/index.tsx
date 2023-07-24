import {Input, InputProps, InputGroup, InputLeftAddon, InputRightAddon} from "@chakra-ui/react"
import React, {FC} from "react"
import {useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type InputControlProps = BaseProps & {
  inputProps?: InputProps
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
}

export const InputControl: FC<InputControlProps> = (props: InputControlProps) => {
  const {name, control, label, inputProps, leftAddon, rightAddon, validationSchema, ...rest} = props
  const {
    field,
    formState: {isSubmitting}
  } = useController({
    name,
    control
  })
  const isRequired = isRequiredField(props.validationSchema, field.name)
  return (
    <FormControl name={name} control={control} label={label} {...rest} isRequired={isRequired}>
      <InputGroup>
        {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
        <Input
          isRequired={isRequired}
          {...field}
          id={name}
          isDisabled={isSubmitting || props.isDisabled}
          {...inputProps}
          value={field.value ?? ""}
        />
        {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
      </InputGroup>
    </FormControl>
  )
}

InputControl.displayName = "InputControl"

export default InputControl
