import {Button, ButtonProps} from "@chakra-ui/react"
import React, {FC} from "react"
import {Control, FieldValues} from "react-hook-form"
import {useFormState} from "react-hook-form/dist/useFormState"

export type SubmitButtonProps = ButtonProps & {
  control: Control<FieldValues, any>
}

export const SubmitButton: FC<SubmitButtonProps> = (props: SubmitButtonProps) => {
  const {children, control, ...rest} = props
  const {isSubmitting} = useFormState({control})

  return (
    <Button type="submit" isLoading={isSubmitting} {...rest}>
      {children}
    </Button>
  )
}

export default SubmitButton
