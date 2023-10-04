import {useRouter} from "next/router"
import {
  AdminAddresses,
  LineItems,
  OrderReturns,
  Orders,
  Payments,
  Shipments,
  SpendingAccounts,
  SupplierAddresses,
  Suppliers
} from "ordercloud-javascript-sdk"
import {useState, useEffect, useCallback} from "react"
import {IOrder} from "types/ordercloud/IOrder"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IOrderPromotion} from "types/ordercloud/IOrderPromotion"
import {IPayment} from "types/ordercloud/IPayment"
import {useAuth} from "./useAuth"
import {ISupplier} from "types/ordercloud/ISupplier"
import {compact, groupBy, uniq} from "lodash"
import {ISupplierAddress} from "types/ordercloud/ISupplierAddress"
import {IAdminAddress} from "types/ordercloud/IAdminAddress"
import {IShipment} from "types/ordercloud/IShipment"
import {IShipmentItem} from "types/ordercloud/IShipmentItem"
import {IOrderReturn} from "types/ordercloud/IOrderReturn"

// this two level map is used to store ship from addresses for each supplier
// SupplierID will be null if it is an admin address
// ex: {SupplierID: {AddressID: Address}}
export type ShipFromAddressMap = Record<string, Record<string, ISupplierAddress | IAdminAddress>>

export function useOrderDetail() {
  const {isAdmin} = useAuth()
  const {isReady, query} = useRouter()
  const [order, setOrder] = useState(null as IOrder)
  const [promotions, setPromotions] = useState([] as IOrderPromotion[])
  const [payments, setPayments] = useState([] as IPayment[])
  const [lineItems, setLineItems] = useState([] as ILineItem[])
  const [loading, setLoading] = useState(true)
  const [suppliers, setSuppliers] = useState([] as ISupplier[])
  const [shipFromAddresses, setShipFromAddresses] = useState({} as ShipFromAddressMap)
  const [shipments, setShipments] = useState([] as IShipment[])
  const [returns, setReturns] = useState([] as IOrderReturn[])

  const fetchLineItems = useCallback(async (order: IOrder) => {
    const lineItemList = await LineItems.List<ILineItem>("All", order.ID, {pageSize: 100})
    const result = lineItemList.Items
    setLineItems(result)
    return result
  }, [])

  const fetchPromotions = useCallback(async (order: IOrder) => {
    const promotionList = await Orders.ListPromotions<IOrderPromotion>("All", order.ID)
    const result = promotionList.Items
    setPromotions(result)
    return result
  }, [])

  const fetchPayments = useCallback(
    async (order: IOrder) => {
      if (!isAdmin) {
        // Suppliers shouldn't see payments
        return
      }
      const paymentList = await Payments.List<IPayment>("All", order.ID)
      const enhancedPaymentRequests = paymentList.Items.map(async (payment) => {
        if (payment.Type === "SpendingAccount") {
          const spendingAccount = await SpendingAccounts.Get(order.FromCompanyID, payment.SpendingAccountID)
          payment["SpendingAccount"] = spendingAccount
        }
        return payment
      })
      const result = await Promise.all(enhancedPaymentRequests)
      setPayments(result)
      return result
    },
    [isAdmin]
  )

  const fetchSuppliers = useCallback(
    async (lineItems: ILineItem[]) => {
      if (!isAdmin) {
        return []
      }
      const supplierIds = lineItems.map((lineItem) => lineItem.Product.DefaultSupplierID)
      const uniqueSupplierIds = uniq(compact(supplierIds))
      if (!uniqueSupplierIds.length) {
        return []
      }
      const supplierList = await Suppliers.List<ISupplier>({filters: {ID: uniqueSupplierIds.join("|")}, pageSize: 100})
      const result = supplierList.Items
      setSuppliers(result)
      return result
    },
    [isAdmin]
  )

  const fetchShipFromAddresses = useCallback(async (lineItems: ILineItem[]) => {
    const groupedLineItems = groupBy(lineItems, (li) => li.Product.DefaultSupplierID)

    const addressRequests = Object.entries(groupedLineItems).map(async ([supplierId, lineItems]) => {
      const uniqueAddressIds = uniq(compact(lineItems.map((lineItem) => lineItem.ShipFromAddressID)))
      if (!uniqueAddressIds.length) {
        return {DefaultSupplierID: supplierId || null, Addresses: []}
      }

      const isSupplierAddresses = Boolean(supplierId)
      if (isSupplierAddresses) {
        const addressList = await SupplierAddresses.List<ISupplierAddress>(supplierId, {
          filters: {ID: uniqueAddressIds.join("|")},
          pageSize: 100
        })
        return {DefaultSupplierID: supplierId, Addresses: addressList.Items}
      }
      const addressList = await AdminAddresses.List<IAdminAddress>({
        filters: {ID: uniqueAddressIds.join("|")},
        pageSize: 100
      })
      return {DefaultSupplierID: null, Addresses: addressList.Items}
    })
    const responses = await Promise.all(addressRequests)
    const addressMap: ShipFromAddressMap = responses.reduce((acc, response) => {
      if (!acc[response.DefaultSupplierID]) {
        acc[response.DefaultSupplierID] = {}
      }
      response.Addresses.forEach((address) => {
        acc[response.DefaultSupplierID][address.ID] = address
      })
      return acc
    }, {})

    setShipFromAddresses(addressMap)
    return addressMap
  }, [])

  const fetchOrder = useCallback(async (orderID: string) => {
    const result = await Orders.Get<IOrder>("All", orderID)
    setOrder(result)
    return result
  }, [])

  const fetchShipments = useCallback(async (order: IOrder) => {
    const shipmentList = await Orders.ListShipments<IShipment>("All", order.ID, {pageSize: 100})
    const enhancedShipmentRequests = shipmentList.Items.map(async (shipment) => {
      const shipmentItemsList = await Shipments.ListItems<IShipmentItem>(shipment.ID, {pageSize: 100})
      shipment.ShipmentItems = shipmentItemsList.Items
      return shipment
    })
    const result = await Promise.all(enhancedShipmentRequests)
    setShipments(result)
    return result
  }, [])

  const fetchReturns = useCallback(async (order: IOrder) => {
    const orderReturns = await OrderReturns.List({filters: {OrderID: order.ID}})
    const result = orderReturns.Items
    setReturns(result)
    return result
  }, [])

  const getOrderAndRelatedData = useCallback(async () => {
    const orderId = query.orderid.toString()
    const _order = await fetchOrder(orderId)
    if (_order) {
      await Promise.all([
        fetchLineItems(_order).then(async (lineItems) => {
          setLineItems(lineItems)
          return await Promise.all([fetchSuppliers(lineItems), fetchShipFromAddresses(lineItems)])
        }),
        fetchPromotions(_order),
        fetchPayments(_order),
        fetchShipments(_order),
        fetchReturns(_order)
      ])
    }
  }, [
    query.orderid,
    fetchOrder,
    fetchLineItems,
    fetchPromotions,
    fetchPayments,
    fetchSuppliers,
    fetchShipFromAddresses,
    fetchShipments,
    fetchReturns
  ])

  useEffect(() => {
    const initializeData = async () => {
      await getOrderAndRelatedData()
      setLoading(false)
    }

    if (isReady) {
      initializeData()
    }
  }, [isReady, getOrderAndRelatedData])

  return {
    // powers loading indicator
    loading,

    // order detail data
    order,
    lineItems,
    promotions,
    payments,
    suppliers,
    shipFromAddresses,
    shipments,
    returns,

    // order detail actions
    fetchOrder,
    fetchLineItems,
    fetchPromotions,
    fetchPayments,
    fetchSuppliers,
    fetchShipFromAddresses,
    fetchShipments,
    fetchReturns
  }
}
