import {Input, InputProps, InputGroup, InputRightElement, Button, ButtonGroup} from "@chakra-ui/react"
import React, {FC, useState, KeyboardEvent} from "react"
import {useController} from "react-hook-form"
import {BaseProps, FormControl} from "../form-control"
import {TbX} from "react-icons/tb"

export type ChipInputControlProps = BaseProps & {
  inputProps?: InputProps
}

export const ChipInputControl: FC<ChipInputControlProps> = (props: ChipInputControlProps) => {
  const {name, control, label, inputProps, validationSchema, ...rest} = props
  const {
    field,
    formState: {isSubmitting}
  } = useController({
    name,
    control
  })
  const [inputValue, setInputValue] = useState("")

  const handleAdd = () => {
    if (Array.isArray(field.value)) {
      field.onChange([...field.value, inputValue])
    } else {
      field.onChange([inputValue])
    }
    setInputValue("")
  }

  const handleRemove = (index: number) => {
    const update = field.value.filter((value, i) => i !== index)
    field.onChange(update)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault() // prevent form from being submitted
      handleAdd()
    }
  }

  return (
    <>
      <FormControl name={name} control={control} label={label} {...rest} validationSchema={validationSchema}>
        <InputGroup>
          <Input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            id={name}
            isDisabled={isSubmitting}
            name={field.name}
            ref={field.ref}
            onKeyDown={handleKeyDown}
            {...inputProps}
          />
          <InputRightElement right=".5rem">
            <Button isDisabled={!inputValue} size="sm" onClick={handleAdd}>
              Add
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <ButtonGroup display="flex" flexWrap="wrap" gap={2}>
        {(Array.isArray(field.value) ? field.value : []).map((value, index) => (
          <Button
            key={index}
            leftIcon={<TbX />}
            variant={"outline"}
            fontWeight={"normal"}
            borderRadius={"full"}
            onClick={() => handleRemove(index)}
            style={{margin: 0}}
          >
            {value}
          </Button>
        ))}
      </ButtonGroup>
    </>
  )
}

ChipInputControl.displayName = "ChipInputControl"

export default ChipInputControl
