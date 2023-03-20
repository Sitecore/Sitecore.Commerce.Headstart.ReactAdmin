import {TextareaControl} from "@/components/formik"
import {validationSchema} from "../meta"
import * as fieldNames from "./fieldNames"

type DescriptionFormProps = {}

export default function DescriptionForm({}: DescriptionFormProps) {
  return <TextareaControl name={fieldNames.DESCRIPTION} validationSchema={validationSchema} />
}
