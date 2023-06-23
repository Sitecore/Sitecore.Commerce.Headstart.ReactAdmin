import Select, {Props as SelectProps} from "react-select"
import React, {FC} from "react"
import {useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"
import {ButtonGroup, Button} from "@chakra-ui/react"
import {TbX} from "react-icons/tb"

export type SelectControlProps = BaseProps & {
  selectProps?: SelectProps<any, true, any>
}

export const SelectControl: FC<SelectControlProps> = (props: SelectControlProps) => {
  const {name, control, label, selectProps, validationSchema, ...rest} = props
  const {
    field,
    formState: {isSubmitting}
  } = useController({
    name,
    control
  })
  const isRequired = isRequiredField(props.validationSchema, field.name)

  const handleRemove = (index: number) => {
    const update = field.value.filter((value, i) => i !== index)
    field.onChange(update)
  }

  return (
    <>
      <FormControl name={name} control={control} label={label} isRequired={isRequired} {...rest}>
        <Select
          {...field}
          {...selectProps}
          isDisabled={isSubmitting}
          controlShouldRenderValue={!selectProps?.isMulti}
        />
      </FormControl>
      <ButtonGroup display="flex" flexWrap="wrap" gap={2} marginTop={2}>
        {(Array.isArray(field.value) ? field.value : []).map((option, index) => (
          <Button
            key={index}
            leftIcon={<TbX />}
            variant="solid"
            fontWeight={"normal"}
            size="sm"
            borderRadius={"full"}
            onClick={() => handleRemove(index)}
            backgroundColor="accent.100"
            style={{margin: 0}}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
    </>
  )
}

SelectControl.displayName = "SelectControl"

export default SelectControl
