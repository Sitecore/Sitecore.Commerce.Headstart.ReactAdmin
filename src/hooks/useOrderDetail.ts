import {useRouter} from "next/router"
import {
  AdminAddresses,
  ImpersonationConfigs,
  LineItems,
  Me,
  Orders,
  Payments,
  SecurityProfiles,
  SupplierAddresses,
  Suppliers,
  Tokens,
  Users
} from "ordercloud-javascript-sdk"
import {useState, useEffect} from "react"
import {IOrder} from "types/ordercloud/IOrder"
import {ILineItem} from "types/ordercloud/ILineItem"
import {IOrderPromotion} from "types/ordercloud/IOrderPromotion"
import {IPayment} from "types/ordercloud/IPayment"
import {useAuth} from "./useAuth"
import {IBuyerAddress} from "types/ordercloud/IBuyerAddress"
import {appSettings} from "constants/app-settings"
import {ISupplier} from "types/ordercloud/ISupplier"
import {ICreditCard} from "types/ordercloud/ICreditCard"
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
  const [billingAddress, setBillingAddress] = useState(null as IBuyerAddress)
  const [payments, setPayments] = useState([] as IPayment[])
  const [lineItems, setLineItems] = useState([] as ILineItem[])
  const [loading, setLoading] = useState(true)
  const [suppliers, setSuppliers] = useState([] as ISupplier[])
  const [shipFromAddresses, setShipFromAddresses] = useState({} as ShipFromAddressMap)

  useEffect(() => {
    const fetchImpersonationToken = async (order: IOrder) => {
      const buyerImpersonationProfile = await SecurityProfiles.Save("ImpersonationBuyer", {
        ID: "ImpersonationBuyer",
        Name: "ImpersonationBuyer",
        Roles: ["Shopper"]
      })
      const buyerID = order.FromCompanyID
      const impersonationConfigId = `admin-impersonating-${buyerID}`
      await ImpersonationConfigs.Save(impersonationConfigId, {
        ID: impersonationConfigId,
        BuyerID: buyerID,
        SecurityProfileID: buyerImpersonationProfile.ID,
        ClientID: appSettings.buyerClientId
      })
      const authResponse = await Users.GetAccessToken(buyerID, order.FromUserID, {
        ClientID: appSettings.buyerClientId,
        Roles: ["Shopper"]
      })
      Tokens.SetImpersonationToken(authResponse.access_token)
    }
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
        // enhance payment with additional credit card and spending account data
        // we need to use impersonation because the credit card and spending account may be personal
        // and not visible via the admin endpoints alone
        if (payment.Type === "CreditCard") {
          const creditCard = await Me.As().GetCreditCard<ICreditCard>(payment.CreditCardID)
          payment["CreditCard"] = creditCard
        } else if (payment.Type === "SpendingAccount") {
          const spendingAccount = await Me.As().GetSpendingAccount(payment.SpendingAccountID)
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

    const fetchBillingAddress = async (order: IOrder) => {
      if (!isAdmin) {
        // Suppliers shouldn't see billing address
        return
      }
      if (order.BillingAddress) {
        // If they use a one time address, the full object will be available here
        return order.BillingAddress
      }
      if (order.BillingAddressID) {
        // If they use a saved address, we need to use impersonation to get it because they may be using a personal address
        return await Me.As().GetAddress(order.BillingAddressID)
      }
      return null
    }

    const getOrder = async () => {
      const orderId = query.orderid.toString()
      const _order = await Orders.Get<IOrder>("All", orderId)
      if (isAdmin) {
        await fetchImpersonationToken(_order)
      }
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
          fetchPayments(_order).then((response) => setPayments(response)),
          fetchBillingAddress(_order).then((response) => setBillingAddress(response))
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
    billingAddress,
    loading,
    suppliers,
    shipFromAddresses
  }
}
