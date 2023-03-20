import {RadioGroup, RadioGroupProps, Stack, StackProps} from "@chakra-ui/react"
import {useField, useFormikContext} from "formik"
import React, {FC, ReactNode} from "react"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type RadioGroupControlProps = BaseProps & {
  radioGroupProps?: RadioGroupProps
  stackProps?: StackProps
  children: ReactNode
  validationSchema?: any
}

export const RadioGroupControl: FC<RadioGroupControlProps> = (props: RadioGroupControlProps) => {
  const {name, label, radioGroupProps, stackProps, children, validationSchema, ...rest} = props
  const [field] = useField(name)
  const {setFieldValue, isSubmitting} = useFormikContext()
  const handleChange = (value: string) => {
    setFieldValue(name, value)
  }
  const isRequired = isRequiredField(props.validationSchema, field.name)

  return (
    <FormControl name={name} label={label} isRequired={isRequired} {...rest}>
      <RadioGroup {...field} onChange={handleChange} isDisabled={isSubmitting} {...radioGroupProps}>
        <Stack direction="row" {...stackProps}>
          {children}
        </Stack>
      </RadioGroup>
    </FormControl>
  )
}

export default RadioGroupControl
