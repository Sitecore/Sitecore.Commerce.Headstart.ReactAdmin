import {Me, Suppliers} from "ordercloud-javascript-sdk"

export async function getMySellerCompanyIds() {
  const me = await Me.Get()
  const sellerId = me.Seller?.ID ? "Admin" : me?.Supplier?.ID
  if (sellerId === "Admin") {
    // an admin can see their own company and all suppliers
    const suppliers = await Suppliers.List()
    return [sellerId, ...suppliers.Items.map((supplier) => supplier.ID)]
  } else {
    // a supplier user can only see their own company
    return [sellerId]
  }
}
