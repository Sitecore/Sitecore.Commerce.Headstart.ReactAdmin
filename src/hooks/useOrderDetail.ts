import {useRouter} from "next/router"
import {
  AdminAddresses,
  LineItems,
  Orders,
  Payments,
  SpendingAccounts,
  SupplierAddresses,
  Suppliers
} from "ordercloud-javascript-sdk"
import {useState, useEffect} from "react"
import {IOrder} from "types/ordercloud/IOrder"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IOrderPromotion} from "types/ordercloud/IOrderPromotion"
import {IPayment} from "types/ordercloud/IPayment"
import {useAuth} from "./useAuth"
import {ISupplier} from "types/ordercloud/ISupplier"
import {compact, groupBy, uniq} from "lodash"
import {ISupplierAddress} from "types/ordercloud/ISupplierAddress"
import {IAdminAddress} from "types/ordercloud/IAdminAddress"

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

  useEffect(() => {
    const fetchLineItems = async (order: IOrder) => {
      const lineItemList = await LineItems.List<ILineItem>("All", order.ID, {pageSize: 100})
      return lineItemList.Items
    }

    const fetchPromotions = async (order: IOrder) => {
      const promotionList = await Orders.ListPromotions<IOrderPromotion>("All", order.ID)
      return promotionList.Items
    }

    const fetchPayments = async (order: IOrder) => {
      if (!isAdmin) {
        // Suppliers shouldn't see payments
        return
      }
      const paymentList = await Payments.List<IPayment>("All", order.ID)
      const enhancedPaymentRequests = paymentList.Items.map(async (payment) => {
        if (payment.Type === "CreditCard") {
          // we need to mock the credit card here because if its a personal credit card the admin can't get it
          // currently a feature request to make this readonly on the order
          payment.CreditCard = {
            ID: "mock-creditcard",
            Token: "mock-token",
            DateCreated: "2023-07-04",
            CardholderName: "John Doe",
            CardType: "Visa",
            PartialAccountNumber: "1234",
            ExpirationDate: "2025-07-04",
            xp: {}
          }
        } else if (payment.Type === "SpendingAccount") {
          const spendingAccount = await SpendingAccounts.Get(order.FromCompanyID, payment.SpendingAccountID)
          payment["SpendingAccount"] = spendingAccount
        }
        return payment
      })
      return await Promise.all(enhancedPaymentRequests)
    }

    const fetchSuppliers = async (lineItems: ILineItem[]) => {
      if (!isAdmin) {
        return []
      }
      const supplierIds = lineItems.map((lineItem) => lineItem.Product.DefaultSupplierID)
      const uniqueSupplierIds = uniq(compact(supplierIds))
      if (!uniqueSupplierIds.length) {
        return []
      }
      const supplierList = await Suppliers.List<ISupplier>({filters: {ID: uniqueSupplierIds.join("|")}, pageSize: 100})
      return supplierList.Items
    }

    const fetchShipFromAddresses = async (lineItems: ILineItem[]) => {
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

      return addressMap
    }

    const getOrder = async () => {
      const orderId = query.orderid.toString()
      const _order = await Orders.Get<IOrder>("All", orderId)
      setOrder(_order)
      if (_order) {
        await Promise.all([
          fetchLineItems(_order).then(async (lineItems) => {
            setLineItems(lineItems)
            return await Promise.all([
              fetchSuppliers(lineItems).then((suppliers) => setSuppliers(suppliers)),
              fetchShipFromAddresses(lineItems).then((addresses) => setShipFromAddresses(addresses))
            ])
          }),
          fetchPromotions(_order).then((response) => setPromotions(response)),
          fetchPayments(_order).then((response) => setPayments(response))
        ])
      }
    }

    const initializeData = async () => {
      await getOrder()
      setLoading(false)
    }

    if (isReady) {
      initializeData()
    }
  }, [query.orderid, isReady, isAdmin])

  return {
    order,
    lineItems,
    promotions,
    payments,
    loading,
    suppliers,
    shipFromAddresses
  }
}
