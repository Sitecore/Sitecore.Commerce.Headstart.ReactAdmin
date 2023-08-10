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
    throw new Error(
      `Please provide value for required environment variable: ${name} and then restart the dev server so that the changes can take effect`
    )
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
  clientId: getEnvironmentVariable("NEXT_PUBLIC_OC_CLIENT_ID", process.env.NEXT_PUBLIC_OC_CLIENT_ID),
  orderCloudApiUrl: getEnvironmentVariable(
    "NEXT_PUBLIC_OC_API_URL",
    process.env.NEXT_PUBLIC_OC_API_URL,
    "https://sandboxapi.ordercloud.io"
  ),
  marketplaceId: getEnvironmentVariable("NEXT_PUBLIC_OC_MARKETPLACE_ID", process.env.NEXT_PUBLIC_OC_MARKETPLACE_ID),
  marketplaceName: getEnvironmentVariable(
    "NEXT_PUBLIC_OC_MARKETPLACE_NAME",
    process.env.NEXT_PUBLIC_OC_MARKETPLACE_NAME
  ),
  useRealDashboardData: getEnvironmentVariable(
    "NEXT_PUBLIC_USE_REAL_DASHBOARD_DATA",
    process.env.NEXT_PUBLIC_USE_REAL_DASHBOARD_DATA,
    "false"
  )
}
