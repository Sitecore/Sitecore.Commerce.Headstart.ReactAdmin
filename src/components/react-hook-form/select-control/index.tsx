import Select, {Props as SelectProps} from "react-select"
import React, {FC} from "react"
import {useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"
import {ButtonGroup, Button} from "@chakra-ui/react"
import {TbX} from "react-icons/tb"

export type SelectControlProps = BaseProps & {
  selectProps?: SelectProps<any, true | false, any>
}

interface ReactSelectOption {
  value: string
  label: string
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

  const handleChange = (options: ReactSelectOption[] | ReactSelectOption) => {
    if (selectProps?.isMulti) {
      const updatedOptions = (options as ReactSelectOption[]).map((o) => o.value)
      field.onChange(updatedOptions)
    } else {
      field.onChange((options as ReactSelectOption).value)
    }
  }

  const getInitialValue = () => {
    if (selectProps?.isMulti) {
      return selectProps.options.filter((option) => field.value.includes(option.value))
    }
    if (Array.isArray(field.value)) {
      throw new Error(
        "Unexpected array value consider setting isMulti=true on <SelectControl /> if multi value is needed"
      )
    }
    return selectProps.options.find((option) => option.value === field.value)
  }

  return (
    <>
      <FormControl name={name} control={control} label={label} isRequired={isRequired} {...rest}>
        <Select
          {...field}
          {...selectProps}
          onChange={handleChange}
          value={getInitialValue()}
          isDisabled={isSubmitting}
          controlShouldRenderValue={!selectProps?.isMulti}
        />
      </FormControl>
      {selectProps?.isMulti && (
        <ButtonGroup display="flex" flexWrap="wrap" gap={2} marginTop={2}>
          {(Array.isArray(field.value) ? field.value : []).map((optionValue, index) => {
            const option = selectProps.options.find((o) => o.value === optionValue)
            return (
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
            )
          })}
        </ButtonGroup>
      )}
    </>
  )
}

export default SelectControl
