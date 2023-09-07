import {ShipmentActionMenu} from "./ShipmentActionMenu"
import {ShipmentSummary} from "./ShipmentSummary"
import {IOrder} from "types/ordercloud/IOrder"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IShipment} from "types/ordercloud/IShipment"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface OrderShipmentsProps {
  shipments: IShipment[]
  lineItems: ILineItem[]
  order: IOrder
  onUpdate: () => void
  onDelete: (shipmentId: string) => void
}
export function OrderShipments({shipments, order, lineItems, onUpdate, onDelete}: OrderShipmentsProps) {
  return (
    <>
      {shipments.map((shipment) => (
        <ShipmentSummary key={shipment.ID} shipment={shipment} lineItems={lineItems} marginBottom={5}>
          <ProtectedContent hasAccess={appPermissions.OrderManager}>
            <ShipmentActionMenu
              shipment={shipment}
              order={order}
              lineItems={lineItems}
              onUpdate={onUpdate}
              onDelete={() => onDelete(shipment.ID)}
            />
          </ProtectedContent>
        </ShipmentSummary>
      ))}
    </>
  )
}
