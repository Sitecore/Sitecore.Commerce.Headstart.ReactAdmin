import {
  Input,
  InputProps,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputLeftElement,
  InputRightElement
} from "@chakra-ui/react"
import React, {FC} from "react"
import {useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type InputControlProps = BaseProps & {
  inputProps?: InputProps
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
  rightElement?: React.ReactNode
  leftElement?: React.ReactNode
}

export const InputControl: FC<InputControlProps> = (props: InputControlProps) => {
  const {
    name,
    control,
    label,
    inputProps,
    leftAddon,
    rightAddon,
    leftElement,
    rightElement,
    validationSchema,
    ...rest
  } = props
  const {
    field,
    formState: {isSubmitting}
  } = useController({
    name,
    control
  })
  const isRequired = isRequiredField(props.validationSchema, field.name)
  return (
    <FormControl
      name={name}
      control={control}
      label={label}
      {...rest}
      validationSchema={validationSchema}
      isRequired={isRequired}
    >
      <InputGroup>
        {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
        {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}
        <Input
          isRequired={isRequired}
          {...field}
          id={name}
          isDisabled={isSubmitting || props.isDisabled}
          {...inputProps}
          value={field.value ?? ""}
        />
        {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
        {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
      </InputGroup>
    </FormControl>
  )
}

InputControl.displayName = "InputControl"

export default InputControl
