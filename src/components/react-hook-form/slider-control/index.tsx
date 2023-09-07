import {
  Slider,
  SliderFilledTrack,
  SliderProps,
  SliderThumb,
  SliderThumbProps,
  SliderTrack,
  SliderTrackProps
} from "@chakra-ui/react"
import React, {FC} from "react"
import {useController} from "react-hook-form"
import {isRequiredField} from "utils"
import {BaseProps, FormControl} from "../form-control"

export type SliderControlProps = BaseProps & {
  sliderProps?: SliderProps
  sliderTrackProps?: SliderTrackProps
  sliderThumbProps?: SliderThumbProps
}

export const SliderControl: FC<SliderControlProps> = (props: SliderControlProps) => {
  const {name, control, label, sliderProps, sliderTrackProps, sliderThumbProps, validationSchema, ...rest} = props
  const {
    field,
    formState: {isSubmitting}
  } = useController({
    name,
    control
  })

  const isRequired = isRequiredField(props.validationSchema, field.name)

  return (
    <FormControl
      name={name}
      control={control}
      label={label}
      isRequired={isRequired}
      validationSchema={validationSchema}
      {...rest}
    >
      <Slider {...field} id={name} isDisabled={isSubmitting || props.isDisabled} {...sliderProps}>
        <SliderTrack {...sliderTrackProps}>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb {...sliderThumbProps} />
      </Slider>
    </FormControl>
  )
}

export default SliderControl
