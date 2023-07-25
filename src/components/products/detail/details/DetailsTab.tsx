import {Flex, SimpleGrid, FlexProps} from "@chakra-ui/react"
import {DescriptionCard} from "./DescriptionCard"
import {DetailsCard} from "./DetailsCard"
import {ImagePreviewCard} from "./ImagePreviewCard"
import {InventoryCard} from "./InventoryCard"
import {ShippingCard} from "./ShippingCard"
import {UnitOfMeasureCard} from "./UnitOfMeasureCard"
import {ProductDetailFormFields} from "../form-meta"
import {Control} from "react-hook-form"
import {IProduct} from "types/ordercloud/IProduct"

interface DetailsTabProps extends FlexProps {
  product: IProduct
  control: Control<ProductDetailFormFields>
}

export function DetailsTab({product, control, ...flexProps}: DetailsTabProps) {
  return (
    <Flex gap={6} flexFlow={{base: "column", xl: "row nowrap"}} {...flexProps}>
      <Flex flexFlow="column" flexGrow="1" gap={6} flexWrap="wrap">
        <DetailsCard control={control} />
        <DescriptionCard control={control} />
        <SimpleGrid gridTemplateColumns={{md: "1fr 1fr"}} gap={6}>
          <UnitOfMeasureCard control={control} />
          <InventoryCard control={control} />
        </SimpleGrid>
        <ShippingCard control={control} />
      </Flex>
      <ImagePreviewCard images={product?.xp?.Images} />
    </Flex>
  )
}
