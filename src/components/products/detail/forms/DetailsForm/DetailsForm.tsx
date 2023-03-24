import {InputControl, SwitchControl} from "@/components/react-hook-form"
import {Grid, GridItem} from "@chakra-ui/react"
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
      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="formInputSpacing">
        <GridItem>
          <InputControl label="Name" name={fieldNames.NAME} control={control} validationSchema={validationSchema} />
        </GridItem>
        <GridItem>
          <InputControl label="SKU" name={fieldNames.SKU} control={control} validationSchema={validationSchema} />
        </GridItem>
      </Grid>
    </>
  )
}
