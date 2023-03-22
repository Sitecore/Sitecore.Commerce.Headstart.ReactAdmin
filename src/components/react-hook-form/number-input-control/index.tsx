import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper
} from "@chakra-ui/react"
import React, {FC} from "react"
import {get, useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type NumberInputControlProps = BaseProps & {
  numberInputProps?: NumberInputProps
  showStepper?: boolean
  children?: React.ReactNode
}

export const NumberInputControl: FC<NumberInputControlProps> = (props: NumberInputControlProps) => {
  const {name, control, label, showStepper = true, children, validationSchema, numberInputProps, ...rest} = props
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
    <FormControl isRequired={isRequired} name={name} control={control} label={label} {...rest}>
      <NumberInput
        {...field}
        id={name}
        isInvalid={!!error && isTouched}
        isDisabled={isSubmitting}
        {...numberInputProps}
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
    </FormControl>
  )
}

NumberInputControl.displayName = "NumberInputControl"

export default NumberInputControl
