import React, {FC, useCallback, useEffect, useMemo, useState} from "react"
import {useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"
import {Select, Props} from "chakra-react-select"
import {ReactSelectOption} from "types/form/ReactSelectOption"

export type SelectControlProps = BaseProps & {
  selectProps?: Props<ReactSelectOption, boolean, any> & {
    loadOptions?: (inputValue: string) => Promise<ReactSelectOption[]>
  }
}

export const SelectControl: FC<SelectControlProps> = (props: SelectControlProps) => {
  const {
    name,
    control,
    label,
    selectProps: {loadOptions, isMulti, inputValue, ...selectProps},
    validationSchema,
    ...rest
  } = props
  const [options, setOptions] = useState<ReactSelectOption[]>((props.selectProps?.options as ReactSelectOption[]) || [])
  const [isLoading, setIsLoading] = useState(false)
  const [optionsLoaded, setOptionsLoaded] = useState(false)
  const {
    field: {onChange: onFieldChange, value: fieldValue, ...field},
    formState: {isSubmitting}
  } = useController({
    name,
    control
  })
  const isRequired = isRequiredField(props.validationSchema, field.name)

  const handleChange = useCallback(
    (options: ReactSelectOption[] | ReactSelectOption, actionMeta) => {
      if (isMulti) {
        const updatedOptions = (options as ReactSelectOption[]).map((o) => o.value)
        onFieldChange(updatedOptions)
      } else {
        onFieldChange((options as ReactSelectOption).value)
      }
      if (props.selectProps?.onChange) props.selectProps.onChange(options, actionMeta)
    },
    [isMulti, onFieldChange, props]
  )

  const value = useMemo(() => {
    if (!options) {
      return []
    }
    if (!fieldValue) {
      return ""
    }
    if (isMulti) {
      return options.filter((option) => fieldValue.includes(option.value))
    }
    if (Array.isArray(fieldValue)) {
      throw new Error(
        "Unexpected array value consider setting isMulti=true on <SelectControl /> if multi value is needed"
      )
    }
    const singleVal = options.find((option) => option.value === fieldValue)
    if ((!options.length && optionsLoaded) || (options.length && !singleVal)) {
      // option not found, so clear it from selection
      onFieldChange("")
    }
    return singleVal
  }, [fieldValue, options, isMulti, onFieldChange, optionsLoaded])

  const loadOptionsCallback = useCallback(
    async (search: string) => {
      if (typeof loadOptions !== "function") return
      try {
        setIsLoading(true)
        const _options = await loadOptions(search)
        setOptions(_options)
        setOptionsLoaded(true)
      } finally {
        setIsLoading(false)
      }
    },
    [loadOptions]
  )

  useEffect(() => {
    loadOptionsCallback(inputValue)
  }, [loadOptionsCallback, inputValue])

  return (
    <>
      <FormControl
        name={name}
        control={control}
        label={label}
        isRequired={isRequired}
        validationSchema={validationSchema}
        {...rest}
      >
        <Select
          {...field}
          {...selectProps}
          isMulti={isMulti}
          isLoading={isLoading}
          options={options}
          onChange={handleChange}
          value={value}
          closeMenuOnSelect={true}
          hideSelectedOptions={true}
          isDisabled={isSubmitting || isLoading || selectProps?.isLoading}
        />
      </FormControl>
    </>
  )
}

export default SelectControl
