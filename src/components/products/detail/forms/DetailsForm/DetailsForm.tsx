import {InputControl, SwitchControl} from "@/components/react-hook-form"
import {HStack} from "@chakra-ui/react"
import {Control, FieldValues} from "react-hook-form"
import {validationSchema} from "../meta"
import * as fieldNames from "./fieldNames"

type DetailsFormProps = {
  control: Control<FieldValues, any>
}

export function DetailsForm({control}: DetailsFormProps) {
  return (
    <>
      <SwitchControl label="Active" name={fieldNames.ACTIVE} control={control} validationSchema={validationSchema} />
      <HStack flexWrap={{base: "wrap", md: "nowrap"}} gap={6} mt={6}>
        <InputControl label="Name" name={fieldNames.NAME} control={control} validationSchema={validationSchema} />
        <InputControl
          style={{marginLeft: 0}}
          label="SKU"
          name={fieldNames.SKU}
          control={control}
          validationSchema={validationSchema}
        />
      </HStack>
    </>
  )
}
