import {ApiRole} from "ordercloud-javascript-sdk"

export type AppPermission =
  | "ProfileManager"
  | "DashboardViewer"
  | "SecurityProfileViewer"
  | "SecurityProfileManager"
  | "ProductViewer"
  | "ProductManager"
  | "PromotionViewer"
  | "PromotionManager"
  | "OrderViewer"
  | "OrderManager"
  | "BuyerViewer"
  | "BuyerManager"
  | "BuyerUserViewer"
  | "BuyerUserManager"
  | "BuyerUserGroupViewer"
  | "BuyerUserGroupManager"
  | "BuyerCatalogViewer"
  | "BuyerCatalogManager"
  | "SupplierViewer"
  | "SupplierManager"
  | "SupplierUserViewer"
  | "SupplierUserManager"
  | "SupplierUserGroupViewer"
  | "SupplierUserGroupManager"
  | "SupplierAddressViewer"
  | "SupplierAddressManager"
  | "AdminUserViewer"
  | "AdminUserManager"
  | "AdminUserGroupViewer"
  | "AdminUserGroupManager"
  | "AdminAddressViewer"
  | "AdminAddressManager"
  | "ProductFacetViewer"
  | "ProductFacetManager"

export interface PermissionConfig {
  /**
   * The name of the permission, displayed in the UI for admins
   */
  Name: string

  /**
   * A short description of the permission, displayed in the UI for admins
   */
  Description: string

  /**
   * A list of API roles that are needed for this permission
   */
  Roles: ApiRole[]

  /**
   * A list of custom roles that are needed for this permission
   */
  CustomRoles: string[]

  /**
   * A list of user types that are allowed to have this permission
   */
  AllowedUserType: ("Supplier" | "Admin")[]

  /**
   * How to group permissions in the UI
   */
  Group: string
}

export const appPermissions: Record<AppPermission, PermissionConfig> = {
  ProductViewer: {
    Name: "Product Viewer",
    Description: "View products",
    Roles: [
      "ProductReader",
      "PriceScheduleReader",
      "CatalogReader",
      "CategoryReader",
      "BuyerReader",
      "UserGroupReader",
      "AdminAddressReader",
      "SupplierAddressReader",
      "ProductFacetReader",
      "SupplierReader"
    ],
    CustomRoles: ["ProductViewer"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Product"
  },
  ProductManager: {
    Name: "Product Manager",
    Description: "View, and manage products",
    Roles: [
      "ProductAdmin",
      "PriceScheduleAdmin",
      "CatalogAdmin",
      "CategoryAdmin",
      "BuyerReader",
      "UserGroupReader",
      "AdminAddressReader",
      "SupplierAddressReader",
      "ProductFacetReader",
      "SupplierReader"
    ],
    CustomRoles: ["ProductManager"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Product"
  },
  PromotionViewer: {
    Name: "Promotion Viewer",
    Description: "View promotions",
    Roles: ["PromotionReader"],
    CustomRoles: ["PromotionViewer"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Product"
  },
  PromotionManager: {
    Name: "Promotion Manager",
    Description: "View, and manage promotions",
    Roles: ["PromotionAdmin"],
    CustomRoles: ["PromotionManager"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Product"
  },
  OrderViewer: {
    Name: "Order Viewer",
    Description: "View orders, shipments, and order returns",
    Roles: ["OrderReader", "ShipmentReader", "SupplierReader", "SupplierAddressReader"],
    CustomRoles: ["OrderViewer"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Order"
  },
  OrderManager: {
    Name: "Order Manager",
    Description: "View and manage orders, shipments, and order returns",
    Roles: ["OrderAdmin", "ShipmentAdmin", "SupplierReader", "SupplierAddressReader"],
    CustomRoles: ["OrderManager"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Order"
  },
  BuyerViewer: {
    Name: "Buyer Viewer",
    Description: "View buyers",
    Roles: ["BuyerReader", "CatalogReader"],
    CustomRoles: ["BuyerViewer"],
    AllowedUserType: ["Admin"],
    Group: "Buyer"
  },
  BuyerManager: {
    Name: "Buyer Manager",
    Description: "View, and manage buyers",
    Roles: ["BuyerAdmin", "CatalogReader"],
    CustomRoles: ["BuyerManager"],
    AllowedUserType: ["Admin"],
    Group: "Buyer"
  },
  BuyerUserViewer: {
    Name: "Buyer User Viewer",
    Description: "View buyer users",
    Roles: ["BuyerUserReader"],
    CustomRoles: ["BuyerUserViewer"],
    AllowedUserType: ["Admin"],
    Group: "Buyer"
  },
  BuyerUserManager: {
    Name: "Buyer User Manager",
    Description: "View, and manage buyer users",
    Roles: ["BuyerUserAdmin"],
    CustomRoles: ["BuyerUserManager"],
    AllowedUserType: ["Admin"],
    Group: "Buyer"
  },
  BuyerUserGroupViewer: {
    Name: "Buyer User Group Viewer",
    Description: "View buyer user groups",
    Roles: ["UserGroupReader"],
    CustomRoles: ["BuyerUserGroupViewer"],
    AllowedUserType: ["Admin"],
    Group: "Buyer"
  },
  BuyerUserGroupManager: {
    Name: "Buyer User Group Manager",
    Description: "View, and manage buyer user groups",
    Roles: ["UserGroupAdmin"],
    CustomRoles: ["BuyerUserGroupManager"],
    AllowedUserType: ["Admin"],
    Group: "Buyer"
  },
  BuyerCatalogViewer: {
    Name: "Buyer Catalog Viewer",
    Description: "View catalogs",
    Roles: ["CatalogReader", "CategoryReader"],
    CustomRoles: ["BuyerCatalogViewer"],
    AllowedUserType: ["Admin"],
    Group: "Buyer"
  },
  BuyerCatalogManager: {
    Name: "Buyer Catalog Manager",
    Description: "View, and manage catalogs",
    Roles: ["CatalogAdmin", "CategoryAdmin"],
    CustomRoles: ["BuyerCatalogManager"],
    AllowedUserType: ["Admin"],
    Group: "Buyer"
  },
  SupplierViewer: {
    Name: "Supplier Viewer",
    Description: "View suppliers",
    Roles: ["SupplierReader"],
    CustomRoles: ["SupplierViewer"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Supplier"
  },
  SupplierManager: {
    Name: "Supplier Manager",
    Description: "View, and manage suppliers",
    Roles: ["SupplierAdmin"],
    CustomRoles: ["SupplierManager"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Supplier"
  },
  SupplierUserViewer: {
    Name: "Supplier User Viewer",
    Description: "View supplier users",
    Roles: ["SupplierUserReader"],
    CustomRoles: ["SupplierUserViewer"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Supplier"
  },
  SupplierUserManager: {
    Name: "Supplier User Manager",
    Description: "View, and manage supplier users",
    Roles: ["SupplierUserAdmin"],
    CustomRoles: ["SupplierUserManager"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Supplier"
  },
  SupplierUserGroupViewer: {
    Name: "Supplier User Group Viewer",
    Description: "View supplier user groups",
    Roles: ["SupplierUserGroupReader"],
    CustomRoles: ["SupplierUserGroupViewer"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Supplier"
  },
  SupplierUserGroupManager: {
    Name: "Supplier User Group Manager",
    Description: "View, and manage supplier user groups",
    Roles: ["SupplierUserGroupAdmin"],
    CustomRoles: ["SupplierUserGroupManager"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Supplier"
  },
  SupplierAddressViewer: {
    Name: "Supplier Address Viewer",
    Description: "View supplier addresses",
    Roles: ["SupplierAddressReader"],
    CustomRoles: ["SupplierAddressViewer"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Supplier"
  },
  SupplierAddressManager: {
    Name: "Supplier Address Manager",
    Description: "View, and manage supplier addresses",
    Roles: ["SupplierAddressAdmin"],
    CustomRoles: ["SupplierAddressManager"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Supplier"
  },
  AdminUserViewer: {
    Name: "Admin User Viewer",
    Description: "View admin users",
    Roles: ["AdminUserReader", "AdminUserGroupReader"],
    CustomRoles: ["AdminUserViewer"],
    AllowedUserType: ["Admin"],
    Group: "Admin"
  },
  AdminUserManager: {
    Name: "Admin User Manager",
    Description: "View, and manage admin users",
    Roles: ["AdminUserAdmin", "AdminUserGroupReader"],
    CustomRoles: ["AdminUserManager"],
    AllowedUserType: ["Admin"],
    Group: "Admin"
  },
  AdminUserGroupViewer: {
    Name: "Admin User Group Viewer",
    Description: "View admin user groups",
    Roles: ["AdminUserGroupReader"],
    CustomRoles: ["AdminUserGroupViewer"],
    AllowedUserType: ["Admin"],
    Group: "Admin"
  },
  AdminUserGroupManager: {
    Name: "Admin User Group Manager",
    Description: "View, and manage admin user groups",
    Roles: ["AdminUserGroupAdmin"],
    CustomRoles: ["AdminUserGroupManager"],
    AllowedUserType: ["Admin"],
    Group: "Admin"
  },
  AdminAddressViewer: {
    Name: "Admin Address Viewer",
    Description: "View admin addresses",
    Roles: ["AdminAddressReader"],
    CustomRoles: ["AdminAddressViewer"],
    AllowedUserType: ["Admin"],
    Group: "Admin"
  },
  AdminAddressManager: {
    Name: "Admin Address Manager",
    Description: "View, and manage admin addresses",
    Roles: ["AdminAddressAdmin"],
    CustomRoles: ["AdminAddressManager"],
    AllowedUserType: ["Admin"],
    Group: "Admin"
  },
  ProductFacetViewer: {
    Name: "Product Facet Viewer",
    Description: "View product facets",
    Roles: ["ProductFacetReader"],
    CustomRoles: ["ProductFacetViewer"],
    AllowedUserType: ["Admin"],
    Group: "Admin"
  },
  ProductFacetManager: {
    Name: "Product Facet Manager",
    Description: "View, and manage product facets",
    Roles: ["ProductFacetAdmin"],
    CustomRoles: ["ProductFacetManager"],
    AllowedUserType: ["Admin"],
    Group: "Admin"
  },
  SecurityProfileViewer: {
    Name: "Security Profile Viewer",
    Description: "View security profiles",
    Roles: ["SecurityProfileReader", "SupplierUserGroupReader", "AdminUserGroupReader", "UserGroupReader"],
    CustomRoles: ["SecurityProfileViewer"],
    AllowedUserType: ["Admin"],
    Group: "Security"
  },
  SecurityProfileManager: {
    Name: "Security Profile Manager",
    Description: "View, and manage security profiles, as well as view and manage assignments to users, and companies",
    Roles: ["SecurityProfileAdmin", "SupplierUserGroupAdmin", "AdminUserGroupAdmin", "UserGroupAdmin"],
    CustomRoles: ["SecurityProfileManager"],
    AllowedUserType: ["Admin"],
    Group: "Security"
  },
  ProfileManager: {
    Name: "Profile Manager",
    Description: "View, and manage own profile, notifications, and theme",
    Roles: ["MeAdmin"],
    CustomRoles: ["ProfileManager"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Miscellaneous"
  },
  DashboardViewer: {
    Name: "Dashboard Viewer",
    Description: "View dashboard reports",
    Roles: ["ProductReader", "OrderReader", "PromotionReader", "BuyerUserReader"],
    CustomRoles: ["DashboardViewer"],
    AllowedUserType: ["Supplier", "Admin"],
    Group: "Miscellaneous"
  }
}
