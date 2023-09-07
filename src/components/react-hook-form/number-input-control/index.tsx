import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
  InputGroup,
  InputLeftAddon,
  InputRightAddon
} from "@chakra-ui/react"
import React, {FC} from "react"
import {get, useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type NumberInputControlProps = BaseProps & {
  numberInputProps?: NumberInputProps
  showStepper?: boolean
  children?: React.ReactNode
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
}

export const NumberInputControl: FC<NumberInputControlProps> = (props: NumberInputControlProps) => {
  const {
    name,
    control,
    label,
    showStepper = true,
    children,
    leftAddon,
    rightAddon,
    validationSchema,
    numberInputProps,
    ...rest
  } = props
  const {
    field,
    fieldState: {isTouched},
    formState: {isSubmitting, errors}
  } = useController({
    name,
    control
  })
  const error = get(errors, name, "")
  const isRequired = isRequiredField(props.validationSchema, field.name)

  return (
    <FormControl
      isRequired={isRequired}
      name={name}
      control={control}
      label={label}
      validationSchema={validationSchema}
      {...rest}
    >
      <InputGroup>
        {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
        <NumberInput
          id={name}
          isInvalid={!!error && isTouched}
          isDisabled={isSubmitting || props.isDisabled}
          {...field}
          {...numberInputProps}
          value={field.value ?? ""}
        >
          <NumberInputField name={name} ref={field.ref} />
          {showStepper && (
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          )}
          {children}
        </NumberInput>
        {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
      </InputGroup>
    </FormControl>
  )
}

NumberInputControl.displayName = "NumberInputControl"

export default NumberInputControl
