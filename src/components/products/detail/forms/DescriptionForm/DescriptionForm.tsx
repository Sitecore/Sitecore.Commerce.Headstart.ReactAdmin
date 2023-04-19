import {TextareaControl} from "@/components/react-hook-form"
import {Control, FieldValues} from "react-hook-form"
import {validationSchema} from "../meta"
import * as fieldNames from "./fieldNames"

type DescriptionFormProps = {
  control: Control<FieldValues, any>
}

export function DescriptionForm({control}: DescriptionFormProps) {
  return <TextareaControl name={fieldNames.DESCRIPTION} control={control} validationSchema={validationSchema} />
}
