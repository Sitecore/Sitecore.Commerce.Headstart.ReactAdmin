import {Select, SelectProps} from "@chakra-ui/react"
import React, {FC} from "react"
import {useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type SelectControlProps = BaseProps & {
  selectProps?: SelectProps
  children: React.ReactNode
}

export const SelectControl: FC<SelectControlProps> = (props: SelectControlProps) => {
  const {name, control, label, selectProps, children, validationSchema, ...rest} = props
  const {
    field,
    formState: {isSubmitting}
  } = useController({
    name,
    control
  })
  const isRequired = isRequiredField(props.validationSchema, field.name)

  return (
    <FormControl name={name} control={control} label={label} isRequired={isRequired} {...rest}>
      <Select {...field} id={name} isDisabled={isSubmitting} {...selectProps}>
        {children}
      </Select>
    </FormControl>
  )
}

SelectControl.displayName = "SelectControl"

export default SelectControl
