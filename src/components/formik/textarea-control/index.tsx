import {Textarea, TextareaProps} from "@chakra-ui/react"
import {useField, useFormikContext} from "formik"
import React, {FC} from "react"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type TextareaControlProps = BaseProps & {
  textareaProps?: TextareaProps
  validationSchema?: any
}

export const TextareaControl: FC<TextareaControlProps> = React.forwardRef(
  (props: TextareaControlProps, ref: React.ForwardedRef<HTMLTextAreaElement>) => {
    const {name, label, textareaProps, validationSchema, ...rest} = props
    const [field] = useField(name)
    const {isSubmitting} = useFormikContext()
    const isRequired = isRequiredField(props.validationSchema, field.name)

    return (
      <FormControl name={name} label={label} isRequired={isRequired} {...rest}>
        <Textarea {...field} id={name} isDisabled={isSubmitting} ref={ref} {...textareaProps} />
      </FormControl>
    )
  }
)

TextareaControl.displayName = "TextareaControl"

export default TextareaControl
