import {useRouter} from "next/router"
import {LineItems, OrderReturns, Payments} from "ordercloud-javascript-sdk"
import {useState, useEffect, useCallback} from "react"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IOrderReturn} from "types/ordercloud/IOrderReturn"
import {IPayment} from "types/ordercloud/IPayment"

export function useOrderReturnDetail() {
  const {isReady, query} = useRouter()
  const [orderReturn, setOrderReturn] = useState(null as IOrderReturn)
  const [payment, setPayment] = useState(null as IPayment)
  const [lineItems, setLineItems] = useState([] as ILineItem[])
  const [loading, setLoading] = useState(true)

  const fetchLineItems = useCallback(async (orderReturn: IOrderReturn) => {
    const lineItemIds = orderReturn.ItemsToReturn.map((item) => item.LineItemID)
    if (!lineItemIds.length) {
      setLineItems([])
    } else {
      const lineItemList = await LineItems.List<ILineItem>("All", orderReturn.OrderID, {
        pageSize: 100,
        filters: {ID: lineItemIds.join("|")}
      })
      setLineItems(lineItemList.Items)
    }
  }, [])

  const fetchOrderReturn = useCallback(async (orderReturnId) => {
    const response = await OrderReturns.Get<IOrderReturn>(orderReturnId)
    setOrderReturn(response)
    return response
  }, [])

  const fetchPayment = useCallback(async (orderReturn: IOrderReturn) => {
    // get a list of payments that aren't order return payments
    const paymentList = await Payments.List("All", orderReturn.OrderID, {
      filters: {Accepted: true, OrderReturnID: "!*"}
    })
    if (paymentList.Items.length > 0) {
      setPayment(paymentList.Items[0])
    }
  }, [])

  const loadPageData = useCallback(async () => {
    const _return = await fetchOrderReturn(query.returnid as string)
    await Promise.all([fetchLineItems(_return), fetchPayment(_return)])
  }, [query.returnid, fetchOrderReturn, fetchLineItems, fetchPayment])

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
    payment,

    // order return actions
    fetchOrderReturn,
    fetchLineItems,
    fetchPayment
  }
}
