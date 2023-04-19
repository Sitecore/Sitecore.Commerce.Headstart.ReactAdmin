import {CheckboxControl, InputControl, SwitchControl} from "@/components/react-hook-form"
import {Flex, HStack} from "@chakra-ui/react"
import {Control, FieldValues, useWatch} from "react-hook-form"
import {validationSchema} from "../meta"
import * as fieldNames from "./fieldNames"

type InventoryFormProps = {
  control: Control<FieldValues, any>
}

export function InventoryForm({control}: InventoryFormProps) {
  const watchedTrackQuantity = useWatch({name: fieldNames.TRACK_QUANTITY, control})

  return (
    <Flex flexDirection="column" gap={2}>
      <SwitchControl
        label="Track Quantity"
        name={fieldNames.TRACK_QUANTITY}
        control={control}
        validationSchema={validationSchema}
      />
      {/* TODO: customize switch control so false reads "the entire product" and true reads "individual variants" */}
      {watchedTrackQuantity && (
        // only show these fields if inventory is enabled
        <>
          <SwitchControl
            label="Track Quantity For Variants"
            name={fieldNames.TRACK_VARIANTS}
            control={control}
            validationSchema={validationSchema}
          />
          <InputControl
            mt={6}
            label="Quantity Available"
            name={fieldNames.INVENTORY_QUANTITY_AVAILABLE}
            control={control}
            validationSchema={validationSchema}
          />
          <CheckboxControl
            label="Orders can be placed exceeding the available inventory"
            name={fieldNames.ORDER_CAN_EXCEED_INVENTORY}
            control={control}
            validationSchema={validationSchema}
          />
        </>
      )}
    </Flex>
  )
}
