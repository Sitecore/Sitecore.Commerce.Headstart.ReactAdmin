import {Checkbox, CheckboxProps} from "@chakra-ui/react"
import {get} from "lodash"
import React, {FC} from "react"
import {useController} from "react-hook-form"
import {BaseProps, FormControl} from "../form-control"

export type CheckboxSingleProps = BaseProps & {
  checkBoxProps?: CheckboxProps
  children?: React.ReactNode
}

export const CheckboxSingleControl: FC<CheckboxSingleProps> = (props: CheckboxSingleProps) => {
  const {name, control, label, children, checkBoxProps, ...rest} = props
  const {
    field,
    fieldState: {isTouched},
    formState: {errors, isSubmitting}
  } = useController({name, control})
  const error = get(errors, name, "")

  const isChecked = field.value

  return (
    <FormControl name={name} control={control} {...rest}>
      <Checkbox
        {...field}
        id={name}
        isInvalid={!!error && isTouched}
        isChecked={isChecked}
        isDisabled={isSubmitting || props.isDisabled}
        {...checkBoxProps}
      >
        {label}
        {children}
      </Checkbox>
    </FormControl>
  )
}

CheckboxSingleControl.displayName = "CheckboxSingleControl"
