/**
 * This file contains all the environment variables that are used in the application.
 * and should be used to reference environment variables rather than directly from NEXT_PUBLIC_*
 * this allows us to:
 *
 * 1. Add validation and throw errors if the environment variable is missing and required
 * 2. Define default values
 * 3. Create a strongly typed interface for the environment variables
 */

import {DEFAULT_THEME_ACCENT, DEFAULT_THEME_PRIMARY, DEFAULT_THEME_SECONDARY} from "theme/foundations/colors"
import {AVAILABLE_GOOGLE_FONTS} from "utils"

// We can't use a dynamic key for process.env because it's not supported by NextJS due to how webpack's DefinePlugin works
// So we must pass along both the name, and the value separately
const getEnvironmentVariable = (name: string, value?: string, defaultValue?: any, isRequired = true): any => {
  if (!value && !defaultValue && isRequired) {
    throw new Error(
      `Please provide value for required environment variable: ${name} and then restart the dev server so that the changes can take effect`
    )
  } else if (!value) {
    return defaultValue
  } else {
    if (typeof defaultValue === "boolean") {
      return value === "true"
    }
    return value
  }
}

const getFont = (name: string, value?: string, defaultValue?: string): string => {
  const font = getEnvironmentVariable(name, value, defaultValue, false)

  if (!font) {
    return font
  }
  if (!AVAILABLE_GOOGLE_FONTS.includes(font)) {
    throw new Error(
      `Please provide a valid font for environment variable: ${name} and then restart the dev server so that the changes can take effect. Available fonts are: ${AVAILABLE_GOOGLE_FONTS.join(
        ", "
      )}`
    )
  }
  return font
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
    false
  ),
  themeColorAccent: getEnvironmentVariable(
    "NEXT_PUBLIC_THEME_COLOR_ACCENT",
    process.env.NEXT_PUBLIC_THEME_COLOR_ACCENT,
    DEFAULT_THEME_ACCENT["500"]
  ),
  themeColorPrimary: getEnvironmentVariable(
    "NEXT_PUBLIC_THEME_COLOR_PRIMARY",
    process.env.NEXT_PUBLIC_THEME_COLOR_PRIMARY,
    DEFAULT_THEME_PRIMARY["500"]
  ),
  themeColorSecondary: getEnvironmentVariable(
    "NEXT_PUBLIC_THEME_COLOR_SECONDARY",
    process.env.NEXT_PUBLIC_THEME_COLOR_SECONDARY,
    DEFAULT_THEME_SECONDARY["500"]
  ),
  themeFontHeading: getFont("NEXT_PUBLIC_THEME_FONT_HEADING", process.env.NEXT_PUBLIC_THEME_FONT_HEADING, ""),
  themeFontBody: getFont("NEXT_PUBLIC_THEME_FONT_BODY", process.env.NEXT_PUBLIC_THEME_FONT_BODY, ""),
  themeLogoUrl: getEnvironmentVariable("NEXT_PUBLIC_THEME_LOGO_URL", process.env.NEXT_PUBLIC_THEME_LOGO_URL, "", false)
}
