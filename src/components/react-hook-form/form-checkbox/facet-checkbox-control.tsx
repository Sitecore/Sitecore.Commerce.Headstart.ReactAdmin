import {Checkbox, CheckboxProps} from "@chakra-ui/react"
import React, {FC} from "react"
import {useController} from "react-hook-form"
import {isRequiredField} from "utils"

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export type FacetCheckboxControlProps = Overwrite<CheckboxProps, {value?: any}> & {
  name: string
  control: any
  label?: string
  validationSchema?: any
  productFacets?: Record<string, string[]>
}

export const FacetCheckboxControl: FC<FacetCheckboxControlProps> = (props: FacetCheckboxControlProps) => {
  const {name, control, label, children, validationSchema, productFacets, ...rest} = props
  const {
    field,
    fieldState: {isTouched},
    formState: {errors, isSubmitting}
  } = useController({name, control})
  const error = errors[name]

  const isRequired = isRequiredField(validationSchema, field.name)

  return (
    <Checkbox
      {...field}
      isRequired={isRequired}
      isInvalid={!!error && isTouched}
      isChecked={field.value}
      isDisabled={isSubmitting}
      {...rest}
    >
      {label}
      {children}
    </Checkbox>
  )
}

FacetCheckboxControl.displayName = "FacetCheckboxControl"

export default FacetCheckboxControl
