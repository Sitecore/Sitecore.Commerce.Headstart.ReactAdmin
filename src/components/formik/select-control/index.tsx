import {Select, SelectProps} from "@chakra-ui/react"
import {useField, useFormikContext} from "formik"
import React, {FC} from "react"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type SelectControlProps = BaseProps & {
  selectProps?: SelectProps
  children: React.ReactNode
  validationSchema?: any
}

export const SelectControl: FC<SelectControlProps> = React.forwardRef(
  (props: SelectControlProps, ref: React.ForwardedRef<HTMLSelectElement>) => {
    const {name, label, selectProps, children, validationSchema, ...rest} = props
    const [field] = useField(name)
    const {isSubmitting} = useFormikContext()
    const isRequired = isRequiredField(props.validationSchema, field.name)

    return (
      <FormControl name={name} label={label} isRequired={isRequired} {...rest}>
        <Select {...field} id={name} isDisabled={isSubmitting} ref={ref} {...selectProps}>
          {children}
        </Select>
      </FormControl>
    )
  }
)

SelectControl.displayName = "SelectControl"

export default SelectControl
