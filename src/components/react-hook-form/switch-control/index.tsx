import {Box, Flex, Switch, SwitchProps} from "@chakra-ui/react"
import {css} from "@emotion/react"
import React, {FC} from "react"
import {get, useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type SwitchControlProps = BaseProps & {switchProps?: SwitchProps}

export const SwitchControl: FC<SwitchControlProps> = (props: SwitchControlProps) => {
  const {name, control, label, switchProps, validationSchema, ...rest} = props
  const {
    field,
    fieldState: {isTouched},
    formState: {isSubmitting, errors}
  } = useController({
    name,
    control
  })
  const error = get(errors, name, "")
  const isRequired = isRequiredField(props.validationSchema, field.name)

  return (
    <Box
      css={css`
        .chakra-form__label {
          margin-bottom: 0;
        }
        .chakra-switch {
          display: flex;
          align-items: center;
          margin-right: 0.75rem;
        }
        .chakra-form__error-message {
          margin-top: 0;
        }
      `}
    >
      <FormControl
        name={name}
        control={control}
        label={label}
        as={Flex}
        alignItems="center"
        isRequired={isRequired}
        {...rest}
      >
        <Switch
          {...field}
          id={name}
          isInvalid={!!error && isTouched}
          isChecked={field.value}
          isDisabled={isSubmitting}
          {...switchProps}
        />
      </FormControl>
    </Box>
  )
}

SwitchControl.displayName = "SwitchControl"

export default SwitchControl
