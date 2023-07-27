/**
 * This file contains all the environment variables that are used in the application.
 * and should be used to reference environment variables rather than directly from NEXT_PUBLIC_*
 * this allows us to:
 *
 * 1. Add validation and throw errors if the environment variable is missing
 * 2. Define default values
 * 3. Create a strongly typed interface for the environment variables
 */

const getEnvironmentVariable = (environmentVariable: string, defaultValue?: string): string => {
  const unvalidatedEnvironmentVariable = process.env[`NEXT_PUBLIC_${environmentVariable}`]
  if (!unvalidatedEnvironmentVariable && !defaultValue) {
    throw new Error(`Couldn't find environment variable: NEXT_PUBLIC_${environmentVariable}`)
  } else if (!unvalidatedEnvironmentVariable) {
    return defaultValue
  } else {
    return unvalidatedEnvironmentVariable
  }
}

export const appSettings = {
  appname: getEnvironmentVariable("APP_NAME", "Sitecore.Commerce.Headstart.ReactAdmin"),
  clientId: getEnvironmentVariable("OC_CLIENT_ID", "4A9F0BAC-EC1D-4711-B01F-1A394F72F2B6"),
  orderCloudApiUrl: getEnvironmentVariable("OC_API_URL", "https://sandboxapi.ordercloud.io"),
  marketplaceId: getEnvironmentVariable("OC_MARKETPLACE_ID", "SitecoreCommerce"),
  marketplaceName: getEnvironmentVariable("OC_MARKETPLACE_NAME", "Sitecore Commerce"),
  useRealDashboardData: getEnvironmentVariable("USE_REAL_DASHBOARD_DATA", "false")
}
