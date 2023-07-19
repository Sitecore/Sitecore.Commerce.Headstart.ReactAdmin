import {Divider} from "@chakra-ui/react"
import {IOrder} from "types/ordercloud/IOrder"
import {priceHelper} from "utils"
import {OrderSummaryItem} from "./OrderSummaryItem"
import {IOrderPromotion} from "types/ordercloud/IOrderPromotion"

interface OrderSummaryProps {
  order: IOrder
  promotions: IOrderPromotion[]
}

export function OrderSummary({order, promotions}: OrderSummaryProps) {
  return (
    <>
      <OrderSummaryItem label="Subtotal" value={priceHelper.formatPrice(order.Total)} />
      <OrderSummaryItem label="Shipping" value={priceHelper.formatPrice(order.ShippingCost)} />
      <OrderSummaryItem label="Tax" value={priceHelper.formatPrice(order.TaxCost)} />
      {promotions.map((promo) => (
        <OrderSummaryItem
          key={promo.ID}
          label={`Promo: ${promo.Code}`}
          labelProps={{color: "primary.500"}}
          valueProps={{color: "primary.500"}}
          value={`-${priceHelper.formatPrice(promo.Amount)}`}
        />
      ))}
      <Divider my={3} />
      <OrderSummaryItem
        label="Total"
        labelProps={{fontWeight: "bold", color: "black"}}
        value={priceHelper.formatPrice(order.Total)}
        valueProps={{fontWeight: "bold"}}
      />
    </>
  )
}
