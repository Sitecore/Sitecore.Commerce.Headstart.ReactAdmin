import {ValuesType} from "types/type-helpers/ValuesType"
import * as yup from "yup"
import * as fieldNames from "./fieldNames"
import {string} from "yup"

type FieldName = ValuesType<typeof fieldNames>

export const imageSchema = {
  Url: string().url().required("Image URL is required"),
  ThumbnailUrl: string().url()
}

export const formShape: Record<FieldName, any> = {
  [fieldNames.IMAGES]: yup.array().of(yup.object().shape(imageSchema))
}
