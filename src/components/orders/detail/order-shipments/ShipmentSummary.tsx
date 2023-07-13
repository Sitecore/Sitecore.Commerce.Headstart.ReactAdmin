import {VStack} from "@chakra-ui/react"
import {IShipment} from "types/ordercloud/IShipment"
import {OrderSummaryItem} from "../order-summary/OrderSummaryItem"
import {ShipmentItemTableSummary} from "./ShipmentItemTableSummary"
import {ILineItem} from "types/ordercloud/ILineItem"
import {dateHelper, priceHelper} from "utils"

interface ShipmentSummaryProps {
  shipment: IShipment
  lineItems: ILineItem[]
}
export function ShipmentSummary({lineItems, shipment}: ShipmentSummaryProps) {
  return (
    <>
      <VStack maxWidth="300px" alignItems="start" marginBottom={7}>
        {shipment.TrackingNumber && <OrderSummaryItem label="Tracking number" value={shipment.TrackingNumber} />}
        {shipment.Shipper && <OrderSummaryItem label="Carrier" value={shipment.Shipper} />}
        {shipment.xp?.ShippingMethod && <OrderSummaryItem label="Shipping method" value={shipment.xp.ShippingMethod} />}
        {shipment.Cost && <OrderSummaryItem label="Cost" value={priceHelper.formatPrice(shipment.Cost)} />}
        {shipment.DateShipped && (
          <OrderSummaryItem label="Shipping date" value={dateHelper.formatShortDate(shipment.DateShipped)} />
        )}
        {shipment.xp?.Comments && <OrderSummaryItem label="Comments" value={shipment.xp.Comments} />}
      </VStack>
      <ShipmentItemTableSummary lineItems={lineItems} shipmentItems={shipment.ShipmentItems} />
    </>
  )
}
