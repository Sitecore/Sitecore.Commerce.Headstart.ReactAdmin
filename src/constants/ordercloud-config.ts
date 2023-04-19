import {uniq} from "lodash"
import {ApiRole, CookieOptions} from "ordercloud-javascript-sdk"
import {appPermissions} from "./app-permissions.config"

const appRoles = uniq(
  Object.keys(appPermissions)
    .map((permissionName) => appPermissions[permissionName])
    .flat()
)

export interface OcConfig {
  clientId: string
  marketplaceId: string
  scope: ApiRole[]
  baseApiUrl?: string
  allowAnonymous?: boolean
  cookieOptions?: CookieOptions
}

const ocConfig: OcConfig = {
  clientId: process.env.NEXT_PUBLIC_OC_CLIENT_ID || "4A9F0BAC-EC1D-4711-B01F-1A394F72F2B6",
  marketplaceId: process.env.NEXT_PUBLIC_OC_MARKETPLACE_ID,
  baseApiUrl: process.env.NEXT_PUBLIC_OC_API_URL || "https://sandboxapi.ordercloud.io",
  scope: appRoles,
  allowAnonymous: false,
  cookieOptions: null
}

export default ocConfig
