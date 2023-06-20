import React, {FC} from "react"
import {useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"
import Select, {AsyncProps} from "react-select/async"
import {ButtonGroup, Button} from "@chakra-ui/react"
import {TbX} from "react-icons/tb"

export type SelectAsyncControlProps = BaseProps & {
  selectProps?: AsyncProps<any, true, any>
}

export const SelectAsyncControl: FC<SelectAsyncControlProps> = (props: SelectAsyncControlProps) => {
  const {name, control, label, selectProps, children, validationSchema, ...rest} = props
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
        <Select {...field} isDisabled={isSubmitting} controlShouldRenderValue={!selectProps.isMulti} {...selectProps} />
      </FormControl>
      <ButtonGroup display="flex" flexWrap="wrap" gap={2} marginTop={2}>
        {(Array.isArray(field.value) ? field.value : []).map((option, index) => (
          <Button
            key={index}
            leftIcon={<TbX />}
            variant={"outline"}
            fontWeight={"normal"}
            borderRadius={"full"}
            size="sm"
            backgroundColor="primary.100"
            onClick={() => handleRemove(index)}
            style={{margin: 0}}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
    </>
  )
}

SelectAsyncControl.displayName = "SelectAsyncControl"

export default SelectAsyncControl
