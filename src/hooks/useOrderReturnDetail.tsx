import {useRouter} from "next/router"
import {LineItems, OrderReturns} from "ordercloud-javascript-sdk"
import {useState, useEffect, useCallback} from "react"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IOrderReturn} from "types/ordercloud/IOrderReturn"

export function useOrderReturnDetail() {
  const {isReady, query} = useRouter()
  const [orderReturn, setOrderReturn] = useState(null as IOrderReturn)
  const [lineItems, setLineItems] = useState([] as ILineItem[])
  const [loading, setLoading] = useState(true)

  const fetchLineItems = useCallback(async (orderReturn: IOrderReturn) => {
    const lineItemIds = orderReturn.ItemsToReturn.map((item) => item.LineItemID)
    const lineItemList = await LineItems.List<ILineItem>("All", orderReturn.OrderID, {
      pageSize: 100,
      filters: {ID: lineItemIds.join("|")}
    })
    setLineItems(lineItemList.Items)
  }, [])

  const fetchOrderReturn = useCallback(async (orderReturnId) => {
    const response = await OrderReturns.Get<IOrderReturn>(orderReturnId)
    setOrderReturn(response)
    return response
  }, [])

  const loadPageData = useCallback(async () => {
    const _return = await fetchOrderReturn(query.returnid as string)
    await fetchLineItems(_return)
  }, [query.returnid, fetchOrderReturn, fetchLineItems])

  useEffect(() => {
    const initializeData = async () => {
      await loadPageData()
      setLoading(false)
    }

    if (isReady) {
      initializeData()
    }
  }, [isReady, loadPageData])

  return {
    // powers loading indicator
    loading,

    // order return data
    orderReturn,
    lineItems,

    // order return actions
    fetchOrderReturn,
    fetchLineItems
  }
}
