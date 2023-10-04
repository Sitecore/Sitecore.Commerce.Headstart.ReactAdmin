import {CookieOptions} from "ordercloud-javascript-sdk"
import {appSettings} from "./app-settings"
export interface OcConfig {
  clientId: string
  marketplaceId: string
  baseApiUrl?: string
  allowAnonymous?: boolean
  cookieOptions?: CookieOptions
}

const ocConfig: OcConfig = {
  clientId: appSettings.clientId,
  marketplaceId: appSettings.marketplaceId,
  baseApiUrl: appSettings.orderCloudApiUrl,
  allowAnonymous: false,
  cookieOptions: null
}

export default ocConfig
