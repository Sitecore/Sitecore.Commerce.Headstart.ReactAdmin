import {Textarea, TextareaProps} from "@chakra-ui/react"
import React, {FC} from "react"
import {useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type TextareaControlProps = BaseProps & {
  textareaProps?: TextareaProps
  validationSchema?: any
}

export const TextareaControl: FC<TextareaControlProps> = (props: TextareaControlProps) => {
  const {name, control, label, textareaProps = {}, validationSchema, ...rest} = props
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
      <Textarea
        {...field}
        {...textareaProps}
        id={name}
        isDisabled={isSubmitting || props.isDisabled}
        value={field.value ?? ""}
      />
    </FormControl>
  )
}

TextareaControl.displayName = "TextareaControl"

export default TextareaControl
