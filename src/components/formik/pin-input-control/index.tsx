import {HStack, PinInput, PinInputField, PinInputProps, StackProps} from "@chakra-ui/react"
import {useField, useFormikContext} from "formik"
import React, {FC} from "react"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type PinInputControlProps = BaseProps & {
  pinAmount: number
  stackProps?: StackProps
  pinInputProps?: Omit<PinInputProps, "children">
  validationSchema?: any
}

export const PinInputControl: FC<PinInputControlProps> = (props: PinInputControlProps) => {
  const {name, label, pinAmount, stackProps, pinInputProps, ...rest} = props
  const [field, , {setValue}] = useField(name)
  const {isSubmitting} = useFormikContext()

  const renderedPinInputFields = Array(pinAmount)
    .fill(null)
    .map((_noop, i) => <PinInputField key={i} />)
  function handleChange(value: string) {
    setValue(value)
  }

  const isRequired = isRequiredField(props.validationSchema, field.name)

  return (
    <FormControl name={name} label={label} isRequired={isRequired} {...rest}>
      <HStack {...stackProps}>
        <PinInput {...field} onChange={handleChange} isDisabled={isSubmitting} {...pinInputProps}>
          {renderedPinInputFields}
        </PinInput>
      </HStack>
    </FormControl>
  )
}

export default PinInputControl
