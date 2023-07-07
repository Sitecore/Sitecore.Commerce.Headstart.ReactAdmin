import {InfoOutlineIcon} from "@chakra-ui/icons"
import {Box, Button, ButtonProps, FormControl, FormErrorMessage} from "@chakra-ui/react"
import {isEmpty} from "lodash"
import React, {FC} from "react"
import {Control, FieldValues} from "react-hook-form"
import {useFormState} from "react-hook-form"

export type SubmitButtonProps = ButtonProps & {
  control: Control<FieldValues, any>
}

export const SubmitButton: FC<SubmitButtonProps> = (props: SubmitButtonProps) => {
  const {children, control, ...rest} = props
  const {isSubmitting, errors} = useFormState({control})

  return (
    <Box>
      {JSON.stringify(errors)}
      <Button type="submit" isLoading={isSubmitting} outlineColor={!isEmpty(errors) && "red"} {...rest}>
        {children}
      </Button>
    </Box>
  )
}

export default SubmitButton
