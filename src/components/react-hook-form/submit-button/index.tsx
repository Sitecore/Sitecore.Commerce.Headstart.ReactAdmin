import {Box, Button, ButtonProps} from "@chakra-ui/react"
import {isEmpty} from "lodash"
import React, {FC} from "react"
import {useFormState} from "react-hook-form"

export type SubmitButtonProps = ButtonProps & {
  control: any
}

export const SubmitButton: FC<SubmitButtonProps> = (props: SubmitButtonProps) => {
  const {children, control, ...rest} = props
  const {isSubmitting, errors} = useFormState({control})

  return (
    <Box>
      <Button type="submit" isLoading={isSubmitting} outlineColor={!isEmpty(errors) && "red"} {...rest}>
        {children}
      </Button>
    </Box>
  )
}

export default SubmitButton
