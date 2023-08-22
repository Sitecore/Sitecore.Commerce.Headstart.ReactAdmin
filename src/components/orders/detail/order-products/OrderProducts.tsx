import {Card, CardBody, CardHeader, Heading} from "@chakra-ui/react"
import {groupBy} from "lodash"
import {ILineItem} from "types/ordercloud/ILineItem"
import {ISupplier} from "types/ordercloud/ISupplier"
import {LineItemTable} from "./LineItemTable"
import {ShipFromAddressMap} from "hooks/useOrderDetail"
import {SingleLineAddress} from "../SingleLineAddress"

interface OrderProductsProps {
  isAdmin?: boolean
  lineItems: ILineItem[]
  suppliers: ISupplier[]
  shipFromAddresses: ShipFromAddressMap
}
export function OrderProducts({isAdmin, lineItems, suppliers, shipFromAddresses}: OrderProductsProps) {
  if (!isAdmin) {
    return <LineItemTable lineItems={lineItems} />
  }
  const shipFromGroupedLineItems = groupBy(lineItems, (li) => li.ShippingAddressID)
  return (
    <>
      {Object.entries(shipFromGroupedLineItems).map(([shipFromAddressId, shipFromLineItems], shipFromIndex) => {
        return (
          <SupplierLineItems
            key={shipFromIndex}
            supplierId={null}
            shipFromAddressId={shipFromAddressId}
            suppliers={suppliers}
            shipFromAddresses={shipFromAddresses}
            lineItems={shipFromLineItems}
          />
        )
      })}
    </>
  )
}

interface SupplierLineItemsProps {
  supplierId?: string
  shipFromAddressId: string
  suppliers: ISupplier[]
  lineItems: ILineItem[]
  shipFromAddresses: ShipFromAddressMap
}
function SupplierLineItems({
  supplierId,
  shipFromAddressId,
  suppliers,
  shipFromAddresses,
  lineItems
}: SupplierLineItemsProps) {
  const address = shipFromAddresses[shipFromAddressId]
  return (
    <Card marginBottom={5} backgroundColor="st.mainBackgroundColor">
      <CardHeader>
        {address?.AddressName && <Heading size="sm">{address?.AddressName}</Heading>}
        {address && <SingleLineAddress address={address} />}
      </CardHeader>
      <CardBody>
        <LineItemTable lineItems={lineItems} />
      </CardBody>
    </Card>
  )
}
