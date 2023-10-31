import {InfoOutlineIcon} from "@chakra-ui/icons"
import {
  FormControl as ChakraFormControl,
  FormControlProps,
  FormErrorMessage,
  FormErrorMessageProps,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  TextProps,
  Tooltip,
  TooltipProps
} from "@chakra-ui/react"
import {get} from "lodash"
import React, {FC} from "react"
import {useController} from "react-hook-form"

export interface BaseProps extends Omit<FormControlProps, "label"> {
  name: string
  control: any
  validationSchema: any // used to determine if field is required
  label?: React.ReactNode
  labelProps?: FormLabelProps
  helperText?: React.ReactNode
  helperTextProps?: TextProps
  tooltipText?: string
  tooltipProps?: TooltipProps
  errorMessageProps?: FormErrorMessageProps
}

export const FormControl: FC<BaseProps> = (props: BaseProps) => {
  const {
    children,
    name,
    control,
    label,
    labelProps,
    helperText,
    helperTextProps,
    tooltipText,
    tooltipProps,
    errorMessageProps,
    validationSchema,
    ...rest
  } = props

  const {
    formState: {errors}
  } = useController({name, control})
  const error = get(errors, name, "") as any
  const hasError = Boolean(error?.message)

  return (
    <ChakraFormControl isInvalid={hasError} {...rest}>
      {label && typeof label === "string" ? (
        <FormLabel htmlFor={name} {...labelProps}>
          {label}{" "}
          {tooltipText && (
            <Tooltip
              label={tooltipText}
              placement="right"
              aria-label={`Tooltip for form field ${name}`}
              {...tooltipProps}
            >
              <InfoOutlineIcon fontSize=".9em" color="neutral.600" />
            </Tooltip>
          )}
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
