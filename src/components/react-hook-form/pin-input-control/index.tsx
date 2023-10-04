import {HStack, PinInput, PinInputField, PinInputProps, StackProps} from "@chakra-ui/react"
import React, {FC} from "react"
import {useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type PinInputControlProps = BaseProps & {
  pinAmount: number
  stackProps?: StackProps
  pinInputProps?: Omit<PinInputProps, "children">
}

export const PinInputControl: FC<PinInputControlProps> = (props: PinInputControlProps) => {
  const {name, control, label, pinAmount, stackProps, pinInputProps, ...rest} = props
  const {
    field,
    formState: {isSubmitting}
  } = useController({
    name,
    control
  })

  const renderedPinInputFields = Array(pinAmount)
    .fill(null)
    .map((_noop, i) => <PinInputField key={i} />)

  const isRequired = isRequiredField(props.validationSchema, field.name)

  return (
    <FormControl name={name} control={control} label={label} isRequired={isRequired} {...rest}>
      <HStack {...stackProps}>
        <PinInput {...field} isDisabled={isSubmitting || props.isDisabled} {...pinInputProps}>
          {renderedPinInputFields}
        </PinInput>
      </HStack>
    </FormControl>
  )
}

export default PinInputControl
