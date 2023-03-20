import {
  Slider,
  SliderFilledTrack,
  SliderProps,
  SliderThumb,
  SliderThumbProps,
  SliderTrack,
  SliderTrackProps
} from "@chakra-ui/react"
import {useField, useFormikContext} from "formik"
import React, {FC} from "react"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type SliderControlProps = BaseProps & {
  sliderProps?: SliderProps
  sliderTrackProps?: SliderTrackProps
  sliderThumbProps?: SliderThumbProps
  validationSchema?: any
}

export const SliderControl: FC<SliderControlProps> = (props: SliderControlProps) => {
  const {name, label, sliderProps, sliderTrackProps, sliderThumbProps, validationSchema, ...rest} = props
  const [field, , {setValue}] = useField(name)
  const {isSubmitting} = useFormikContext()

  function handleChange(value: number) {
    setValue(value)
  }
  // Does not behave like expected, so we manually handle it.
  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    ;(e.target as any).name = name
    field.onBlur(e)
  }

  const isRequired = isRequiredField(props.validationSchema, field.name)

  return (
    <FormControl name={name} label={label} isRequired={isRequired} {...rest}>
      <Slider
        {...field}
        id={name}
        onChange={handleChange}
        onBlur={handleBlur}
        isDisabled={isSubmitting}
        {...sliderProps}
      >
        <SliderTrack {...sliderTrackProps}>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb {...sliderThumbProps} />
      </Slider>
    </FormControl>
  )
}

export default SliderControl
