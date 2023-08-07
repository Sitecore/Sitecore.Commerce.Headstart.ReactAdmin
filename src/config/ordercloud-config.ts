import {uniq} from "lodash"
import {ApiRole, CookieOptions} from "ordercloud-javascript-sdk"
import {appPermissions} from "./app-permissions.config"
import {appSettings} from "./app-settings"

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
  clientId: appSettings.clientId,
  marketplaceId: appSettings.marketplaceId,
  baseApiUrl: appSettings.orderCloudApiUrl,
  scope: appRoles,
  allowAnonymous: false,
  cookieOptions: null
}

export default ocConfig
