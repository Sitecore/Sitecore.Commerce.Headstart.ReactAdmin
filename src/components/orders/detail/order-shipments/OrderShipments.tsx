import {Card, CardHeader, HStack, Heading, CardBody} from "@chakra-ui/react"
import {ShipmentActionMenu} from "./ShipmentActionMenu"
import {ShipmentSummary} from "./ShipmentSummary"
import {IOrder} from "types/ordercloud/IOrder"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IShipment} from "types/ordercloud/IShipment"

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
      {shipments.map((shipment) => {
        return (
          <Card key={shipment.ID} marginBottom={5} backgroundColor="st.mainBackgroundColor">
            <CardHeader>
              <HStack justifyContent="space-between">
                <Heading size="sm">Shipment #{shipment.ID}</Heading>
                <ShipmentActionMenu
                  shipment={shipment}
                  order={order}
                  lineItems={lineItems}
                  onUpdate={onUpdate}
                  onDelete={() => onDelete(shipment.ID)}
                />
              </HStack>
            </CardHeader>
            <CardBody>
              <ShipmentSummary shipment={shipment} lineItems={lineItems} />
            </CardBody>
          </Card>
        )
      })}
    </>
  )
}
