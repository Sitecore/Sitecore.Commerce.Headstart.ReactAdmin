import {RadioGroup, RadioGroupProps, Stack, StackProps} from "@chakra-ui/react"
import React, {FC, ReactNode} from "react"
import {useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type RadioGroupControlProps = BaseProps & {
  radioGroupProps?: RadioGroupProps
  stackProps?: StackProps
  children: ReactNode
}

export const RadioGroupControl: FC<RadioGroupControlProps> = (props: RadioGroupControlProps) => {
  const {name, control, label, radioGroupProps, stackProps, children, validationSchema, ...rest} = props
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
      isRequired={isRequired}
      validationSchema={validationSchema}
      {...rest}
    >
      <RadioGroup colorScheme="primary" {...field} isDisabled={isSubmitting || props.isDisabled} {...radioGroupProps}>
        <Stack direction="row" {...stackProps}>
          {children}
        </Stack>
      </RadioGroup>
    </FormControl>
  )
}

export default RadioGroupControl
