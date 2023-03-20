import {Input, InputProps} from "@chakra-ui/react"
import {useField, useFormikContext} from "formik"
import React, {FC, ForwardedRef} from "react"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type InputControlProps = BaseProps & {inputProps?: InputProps; validationSchema?: any}

export const InputControl: FC<InputControlProps> = React.forwardRef(
  (props: InputControlProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {name, label, inputProps, validationSchema, ...rest} = props
    const [field] = useField(name)
    const {isSubmitting} = useFormikContext()
    const isRequired = isRequiredField(props.validationSchema, field.name)
    return (
      <FormControl name={name} label={label} {...rest} isRequired={isRequired}>
        <Input isRequired={isRequired} {...field} id={name} isDisabled={isSubmitting} {...inputProps} ref={ref} />
      </FormControl>
    )
  }
)

InputControl.displayName = "InputControl"

export default InputControl
