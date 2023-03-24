import {Button, ButtonProps} from "@chakra-ui/react"
import React, {FC} from "react"
import {Control, FieldValues, UseFormReset, useFormState} from "react-hook-form"

export type ResetButtonProps = ButtonProps & {
  control: Control<FieldValues, any>
  reset: UseFormReset<any>
}

export const ResetButton: FC<ResetButtonProps> = (props: ResetButtonProps) => {
  const {children, control, reset, ...rest} = props
  const {isSubmitting, isDirty} = useFormState({control})

  return (
    <Button type="reset" onClick={() => reset()} isDisabled={isSubmitting || !isDirty} {...rest}>
      {children}
    </Button>
  )
}

export default ResetButton
