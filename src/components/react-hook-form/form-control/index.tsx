import {InfoIcon, InfoOutlineIcon} from "@chakra-ui/icons"
import {
  FormControl as ChakraFormControl,
  FormControlProps,
  FormErrorMessage,
  FormErrorMessageProps,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  TextProps
} from "@chakra-ui/react"
import {get} from "lodash"
import React, {FC} from "react"
import {Control, FieldValues, useController} from "react-hook-form"

export interface BaseProps extends Omit<FormControlProps, "label"> {
  name: string
  control: any
  validationSchema?: any
  label?: React.ReactNode
  labelProps?: FormLabelProps
  helperText?: React.ReactNode
  helperTextProps?: TextProps
  errorMessageProps?: FormErrorMessageProps
}

export const FormControl: FC<BaseProps> = (props: BaseProps) => {
  const {children, name, control, label, labelProps, helperText, helperTextProps, errorMessageProps, ...rest} = props

  const {
    formState: {errors}
  } = useController({name, control})
  const error = get(errors, name, "") as any
  const hasError = Boolean(error?.message)

  return (
    <ChakraFormControl isInvalid={hasError} {...rest}>
      {label && typeof label === "string" ? (
        <FormLabel m={0} htmlFor={name} {...labelProps}>
          {label}
        </FormLabel>
      ) : (
        label
      )}
      {children}
      {error && (
        <FormErrorMessage {...errorMessageProps}>
          <InfoOutlineIcon marginRight={2} />
          {error.message}
        </FormErrorMessage>
      )}
      {helperText && typeof helperText === "string" ? (
        <FormHelperText {...helperTextProps}>{helperText}</FormHelperText>
      ) : (
        helperText
      )}
    </ChakraFormControl>
  )
}

export default FormControl
