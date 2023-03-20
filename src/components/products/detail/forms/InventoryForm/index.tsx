import {CheckboxControl, InputControl, SwitchControl} from "@/components/formik"
import {useField} from "formik"
import {validationSchema} from "../meta"
import * as fieldNames from "./fieldNames"

type InventoryFormProps = {}

export default function InventoryForm({}: InventoryFormProps) {
  const [trackQuantityField] = useField(fieldNames.TRACK_QUANTITY)

  return (
    <>
      <SwitchControl label="Track Quantity" name={fieldNames.TRACK_QUANTITY} validationSchema={validationSchema} />
      {/* TODO: customize switch control so false reads "the entire product" and true reads "individual variants" */}
      {trackQuantityField.value && (
        // only show these fields if inventory is enabled
        <>
          <SwitchControl
            label="Track Quantity For Variants"
            name={fieldNames.TRACK_VARIANTS}
            validationSchema={validationSchema}
          />
          <InputControl
            label="Quantity Available"
            name={fieldNames.INVENTORY_QUANTITY_AVAILABLE}
            validationSchema={validationSchema}
          />
          <CheckboxControl
            label="Orders can be placed exceeding the available inventory"
            name={fieldNames.ORDER_CAN_EXCEED_INVENTORY}
            validationSchema={validationSchema}
          />
        </>
      )}
    </>
  )
}
