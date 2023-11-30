import {Input, InputProps} from "@chakra-ui/react"
import React, {FC, useMemo} from "react"
import {useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"
import {utcToZonedTime, zonedTimeToUtc, format} from "date-fns-tz"

export type DatePickerLocalControlProps = BaseProps & {
  type: "date" | "date-time"
  inputProps?: InputProps
}

export const DatePickerLocalControl: FC<DatePickerLocalControlProps> = (props: DatePickerLocalControlProps) => {
  const {name, control, label, inputProps, validationSchema, type, ...rest} = props
  const {
    field,
    formState: {isSubmitting}
  } = useController({
    name,
    control
  })
  const isRequired = isRequiredField(props.validationSchema, field.name)
  const userTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])

  const value = useMemo(() => {
    // we will get an ISO date string from OrderCloud and need to convert it to local time
    if (!field.value) {
      return ""
    }
    const utcDate = new Date(field.value)
    const localDate = utcToZonedTime(utcDate, userTimezone)
    if (type === "date-time") {
      return format(localDate, "yyyy-MM-dd'T'HH:mm")
    } else {
      return format(localDate, "yyyy-MM-dd")
    }
  }, [field.value, userTimezone, type])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Convert the local time to UTC before saving
    const value = event.target.value
    const utcTime = zonedTimeToUtc(value, userTimezone)
    field.onChange(utcTime.toISOString())
  }

  return (
    <FormControl
      name={name}
      control={control}
      label={`${label} (${userTimezone})`}
      {...rest}
      validationSchema={validationSchema}
      isRequired={isRequired}
    >
      <Input
        type={props.type === "date" ? "date" : "datetime-local"}
        isRequired={isRequired}
        {...field}
        id={name}
        isDisabled={isSubmitting || props.isDisabled}
        {...inputProps}
        value={value}
        onChange={handleChange}
      />
    </FormControl>
  )
}

DatePickerLocalControl.displayName = "DatePickerLocalControl"

export default DatePickerLocalControl
