import {ApiRole} from "ordercloud-javascript-sdk"

type AppPermission =
  | "OrderManager"
  | "ShipmentManager"
  | "ProductManager"
  | "BuyerManager"
  | "ReportViewer"
  | "MeManager"
  | "SupplierManager"
  | "SettingsManager"

export const appPermissions: Record<AppPermission, ApiRole[]> = {
  OrderManager: ["OrderAdmin", "AddressAdmin", "SupplierAddressReader"],
  ProductManager: ["ProductAdmin", "PromotionAdmin", "PriceScheduleAdmin", "ProductFacetReader"],
  ShipmentManager: ["ShipmentAdmin"],
  BuyerManager: ["BuyerAdmin", "BuyerUserAdmin", "CatalogAdmin", "UserGroupAdmin", "CategoryAdmin"],
  SupplierManager: ["SupplierAdmin", "SupplierAddressAdmin", "SupplierUserAdmin", "SupplierUserGroupAdmin"],
  ReportViewer: ["OrderAdmin", "ProductAdmin"],
  MeManager: ["MeAdmin", "MeXpAdmin"],
  SettingsManager: ["ProductFacetAdmin", "AdminUserAdmin", "AdminUserGroupAdmin", "AdminAddressAdmin"]
}
