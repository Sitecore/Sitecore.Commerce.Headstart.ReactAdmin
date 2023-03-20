import {InputControl, SwitchControl} from "@/components/formik"
import {Grid, GridItem} from "@chakra-ui/react"
import {validationSchema} from "../meta"
import * as fieldNames from "./fieldNames"

type DetailsFormProps = {}

export default function DetailsForm({}: DetailsFormProps) {
  return (
    <>
      <SwitchControl label="Active" name={fieldNames.ACTIVE} />
      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
        <GridItem>
          <InputControl label="Name" name={fieldNames.NAME} validationSchema={validationSchema} />
        </GridItem>
        <GridItem>
          <InputControl label="SKU" name={fieldNames.SKU} validationSchema={validationSchema} />
        </GridItem>
      </Grid>
    </>
  )
}
