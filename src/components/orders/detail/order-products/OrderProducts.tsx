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
  const shipFromGroupedLineItems = groupBy(lineItems, (li) => li.ShipFromAddressID)
  return (
    <>
      {Object.entries(shipFromGroupedLineItems).map(([shipFromAddressId, shipFromLineItems], shipFromIndex) => {
        if (shipFromAddressId) {
          const supplierId = shipFromLineItems[0].Product.DefaultSupplierID
          return (
            <SupplierLineItems
              key={shipFromIndex}
              supplierId={supplierId}
              shipFromAddressId={shipFromAddressId}
              suppliers={suppliers}
              shipFromAddresses={shipFromAddresses}
              lineItems={shipFromLineItems}
            />
          )
        } else {
          const supplierGroupedLineItems = groupBy(shipFromLineItems, (li) => li.Product.DefaultSupplierID)
          return Object.entries(supplierGroupedLineItems).map(([supplierId, supplierLineItems], supplierIndex) => {
            return (
              <SupplierLineItems
                key={shipFromIndex + supplierIndex}
                supplierId={supplierId}
                shipFromAddressId={null}
                suppliers={suppliers}
                shipFromAddresses={shipFromAddresses}
                lineItems={supplierLineItems}
              />
            )
          })
        }
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
  const supplier = suppliers.find((supplier) => supplier.ID === supplierId)
  const address = shipFromAddresses[supplierId] ? shipFromAddresses[supplierId][shipFromAddressId] : null
  return (
    <Card marginBottom={5} backgroundColor="st.mainBackgroundColor">
      <CardHeader>
        <Heading size="sm">{supplier?.Name || "Admin"}</Heading>
        {address && <SingleLineAddress address={address} />}
      </CardHeader>
      <CardBody>
        <LineItemTable lineItems={lineItems} />
      </CardBody>
    </Card>
  )
}
