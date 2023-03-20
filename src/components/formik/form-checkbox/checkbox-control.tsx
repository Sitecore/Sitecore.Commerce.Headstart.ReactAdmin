import {Checkbox, CheckboxProps} from "@chakra-ui/react"
import {useField, useFormikContext} from "formik"
import React, {FC} from "react"
import {isRequiredField} from "utils"

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export type CheckboxControlProps = Overwrite<CheckboxProps, {value?: string | number}> & {
  name: string
  label?: string
  validationSchema?: any
}

export const CheckboxControl: FC<CheckboxControlProps> = React.forwardRef(
  (props: CheckboxControlProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const {name, label, children, validationSchema, ...rest} = props
    const [field, {error, touched}] = useField(name)
    const {isSubmitting} = useFormikContext()

    let isChecked
    if (field.value instanceof Array) {
      isChecked = field.value.includes(props.value) ?? false
    }

    const isRequired = isRequiredField(props.validationSchema, field.name)

    return (
      <Checkbox
        {...field}
        isRequired={isRequired}
        isInvalid={!!error && touched}
        isChecked={isChecked}
        isDisabled={isSubmitting}
        ref={ref}
        {...rest}
      >
        {label}
        {children}
      </Checkbox>
    )
  }
)

CheckboxControl.displayName = "CheckboxControl"

export default CheckboxControl
