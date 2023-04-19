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
    <FormControl
      name={name}
      control={control}
      label={label}
      isRequired={isRequired}
      {...rest}
      display="inline-flex"
      alignItems="center"
      gap={2}
    >
      <Switch
        colorScheme={"primary"}
        {...field}
        id={name}
        isInvalid={!!error && isTouched}
        isChecked={field.value}
        isDisabled={isSubmitting}
        {...switchProps}
      />
    </FormControl>
  )
}

SwitchControl.displayName = "SwitchControl"

export default SwitchControl
