import {Button, ButtonProps, Hide, IconButton, theme, useMediaQuery} from "@chakra-ui/react"
import React, {FC} from "react"
import {Control, FieldValues, UseFormReset, useFormState} from "react-hook-form"
import {TbArrowBackUp, TbTableExport, TbTrash} from "react-icons/tb"

export type ResetButtonProps = ButtonProps & {
  control: any
  reset: UseFormReset<any>
}

export const ResetButton: FC<ResetButtonProps> = (props: ResetButtonProps) => {
  const {children, control, reset, ...rest} = props
  const {isSubmitting, isDirty} = useFormState({control})

  const [belowSm] = useMediaQuery(`(max-width: ${theme.breakpoints["sm"]})`, {
    ssr: true,
    fallback: false // return false on the server, and re-evaluate on the client side
  })

  return (
    <>
      <Hide below="md">
        <Button variant="outline" minW="unset" onClick={() => reset()} isDisabled={isSubmitting || !isDirty}>
          {children}
        </Button>
      </Hide>

      <Hide above="md">
        {belowSm ? (
          <IconButton
            variant="outline"
            colorScheme="red"
            aria-label="discard changes"
            isDisabled={isSubmitting || !isDirty}
            {...rest}
            type="reset"
            onClick={() => reset()}
            icon={<TbArrowBackUp size="1rem" />}
          />
        ) : (
          <Button
            isDisabled={isSubmitting || !isDirty}
            {...rest}
            type="reset"
            onClick={() => reset()}
            display="flex"
            justifyContent={"flex-start"}
            variant="unstyled"
            px={3}
            _hover={{backgroundColor: "gray.100"}}
            w="full"
            textAlign="left"
            borderRadius="0"
            fontWeight="normal"
            leftIcon={<TbTrash size="1rem" />}
          >
            {children}
          </Button>
        )}
      </Hide>
    </>
  )
}

export default ResetButton
