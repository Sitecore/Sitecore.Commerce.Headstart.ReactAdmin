import {Checkbox, CheckboxProps} from "@chakra-ui/react"
import React, {FC} from "react"
import {Control, FieldValues, get, useController} from "react-hook-form"
import {isRequiredField} from "utils"

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export type CheckboxControlProps = Overwrite<CheckboxProps, {value?: string | number}> & {
  name: string
  control: any
  label?: string
  validationSchema?: any
}

export const CheckboxControl: FC<CheckboxControlProps> = (props: CheckboxControlProps) => {
  const {name, control, label, children, validationSchema, ...rest} = props
  const {
    field,
    fieldState: {isTouched},
    formState: {errors, isSubmitting}
  } = useController({name, control})
  const error = get(errors, name, "")

  let isChecked
  if (field.value instanceof Array) {
    isChecked = field.value.includes(props.value) ?? false
  } else {
    isChecked = field.value ?? false
  }

  const isRequired = isRequiredField(props.validationSchema, field.name)

  return (
    <Checkbox
      {...field}
      isRequired={isRequired}
      isInvalid={!!error && isTouched}
      isChecked={isChecked}
      isDisabled={isSubmitting || props.isDisabled}
      {...rest}
    >
      {label}
      {children}
    </Checkbox>
  )
}

CheckboxControl.displayName = "CheckboxControl"

export default CheckboxControl
