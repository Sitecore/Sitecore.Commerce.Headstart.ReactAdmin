import {Configuration, Filters, SearchType} from "ordercloud-javascript-sdk"
import ocConfig from "config/ordercloud-config"

export function SetConfiguration() {
  Configuration.Set({
    clientID: ocConfig.clientId,
    baseApiUrl: ocConfig.baseApiUrl,
    cookieOptions: ocConfig.cookieOptions
  })
}
