import {
  Input,
  InputProps,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputLeftElement,
  InputRightElement,
  InputLeftAddonProps,
  InputRightAddonProps,
  InputRightElementProps,
  InputLeftElementProps
} from "@chakra-ui/react"
import React, {FC} from "react"
import {useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type InputControlProps = BaseProps & {
  inputProps?: InputProps
  leftAddon?: React.ReactNode
  leftAddonProps?: InputLeftAddonProps
  rightAddon?: React.ReactNode
  rightAddonProps?: InputRightAddonProps
  rightElement?: React.ReactNode
  rightElementProps?: InputRightElementProps
  leftElement?: React.ReactNode
  leftElementProps?: InputLeftElementProps
}

export const InputControl: FC<InputControlProps> = (props: InputControlProps) => {
  const {
    name,
    control,
    label,
    inputProps,
    leftAddon,
    leftAddonProps,
    rightAddon,
    rightAddonProps,
    leftElement,
    leftElementProps,
    rightElement,
    rightElementProps,
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
        {leftAddon && <InputLeftAddon {...leftAddonProps}>{leftAddon}</InputLeftAddon>}
        {leftElement && <InputLeftElement {...leftElementProps}>{leftElement}</InputLeftElement>}
        <Input
          isRequired={isRequired}
          {...field}
          id={name}
          isDisabled={isSubmitting || props.isDisabled}
          {...inputProps}
          value={field.value ?? ""}
        />
        {rightElement && <InputRightElement {...rightElementProps}>{rightElement}</InputRightElement>}
        {rightAddon && <InputRightAddon {...rightAddonProps}>{rightAddon}</InputRightAddon>}
      </InputGroup>
    </FormControl>
  )
}

InputControl.displayName = "InputControl"

export default InputControl
