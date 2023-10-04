import {Flex, FlexProps} from "@chakra-ui/react"
import {DescriptionCard} from "./DescriptionCard"
import {DetailsCard} from "./DetailsCard"
import {ImagePreviewCard} from "./ImagePreviewCard"
import {ProductDetailFormFields} from "../form-meta"
import {Control} from "react-hook-form"
import {IProduct} from "types/ordercloud/IProduct"

interface DetailsTabProps extends FlexProps {
  product: IProduct
  control: Control<ProductDetailFormFields>
  validationSchema: any
  isCreatingNew?: boolean
}

export function DetailsTab({product, control, validationSchema, isCreatingNew, ...flexProps}: DetailsTabProps) {
  return (
    <Flex gap={6} flexFlow={{base: "column", xl: "row nowrap"}} {...flexProps}>
      <Flex flexFlow="column" flexGrow="1" gap={6} flexWrap="wrap">
        <DetailsCard control={control} validationSchema={validationSchema} isCreatingNew={isCreatingNew} />
        <DescriptionCard control={control} />
      </Flex>
      <ImagePreviewCard images={product?.xp?.Images} />
    </Flex>
  )
}
