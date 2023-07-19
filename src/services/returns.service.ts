import {flatten} from "lodash"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IOrderReturn} from "types/ordercloud/IOrderReturn"

export const getMaxReturnQuantity = (lineItem: ILineItem, orderReturns: IOrderReturn[]) => {
  const otherReturnItems = flatten(
    orderReturns
      .filter((orderReturn) => orderReturn.ItemsToReturn.some((returnItem) => returnItem.LineItemID === lineItem.ID))
      .map((orderReturn) => orderReturn.ItemsToReturn.filter((returnItem) => returnItem.LineItemID === lineItem.ID))
  )
  const quantityAlreadyReturned = otherReturnItems.reduce((acc, returnItem) => acc + returnItem.Quantity || 0, 0)
  return lineItem.QuantityShipped - quantityAlreadyReturned
}
