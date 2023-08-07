/**
 * This file contains all the environment variables that are used in the application.
 * and should be used to reference environment variables rather than directly from NEXT_PUBLIC_*
 * this allows us to:
 *
 * 1. Add validation and throw errors if the environment variable is missing
 * 2. Define default values
 * 3. Create a strongly typed interface for the environment variables
 */

// We can't use a dynamic key for process.env because it's not supported by NextJS due to how webpack's DefinePlugin works
// So we must pass along both the name, and the value separately
const getEnvironmentVariable = (name: string, value?: string, defaultValue?: string): string => {
  if (!value && !defaultValue) {
    throw new Error(`Couldn't find environment variable: ${name}`)
  } else if (!value) {
    return defaultValue
  } else {
    return value
  }
}

export const appSettings = {
  appname: getEnvironmentVariable(
    "NEXT_PUBLIC_APP_NAME",
    process.env.NEXT_PUBLIC_APP_NAME,
    "Sitecore.Commerce.Headstart.ReactAdmin"
  ),
  clientId: getEnvironmentVariable(
    "NEXT_PUBLIC_OC_CLIENT_ID",
    process.env.NEXT_PUBLIC_OC_CLIENT_ID,
    "4A9F0BAC-EC1D-4711-B01F-1A394F72F2B6"
  ),
  orderCloudApiUrl: getEnvironmentVariable(
    "NEXT_PUBLIC_OC_API_URL",
    process.env.NEXT_PUBLIC_OC_API_URL,
    "https://sandboxapi.ordercloud.io"
  ),
  marketplaceId: getEnvironmentVariable(
    "NEXT_PUBLIC_OC_MARKETPLACE_ID",
    process.env.NEXT_PUBLIC_OC_MARKETPLACE_ID,
    "SitecoreCommerce"
  ),
  marketplaceName: getEnvironmentVariable(
    "NEXT_PUBLIC_OC_MARKETPLACE_NAME",
    process.env.NEXT_PUBLIC_OC_MARKETPLACE_NAME,
    "Sitecore Commerce"
  ),
  useRealDashboardData: getEnvironmentVariable(
    "NEXT_PUBLIC_USE_REAL_DASHBOARD_DATA",
    process.env.NEXT_PUBLIC_USE_REAL_DASHBOARD_DATA,
    "false"
  )
}
