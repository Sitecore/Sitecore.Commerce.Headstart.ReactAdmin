import {format} from "date-fns"

export const dateHelper = {
  formatDate,
  formatCreditCardDate,
  formatShortDate
}

/**
 * Formats an iso date (such as one from OrderCloud)
 * to a user friendly date/time
 * ex: November 13th at 3:52 PM
 *
 * https://date-fns.org/v2.29.2/docs/format
 */
function formatDate(isoDateString: string) {
  if (!isoDateString) {
    return
  }
  const date = new Date(isoDateString)
  const formattedDate = format(date, "MMMM do 'at' h:mmaaa")
  return formattedDate
}

/**
 * Formats an iso date (such as one from OrderCloud)
 * to a short user friendly date
 * ex: 11/13/2023
 */
function formatShortDate(isoDateString: string) {
  if (!isoDateString) {
    return
  }
  const date = new Date(
    isoDateString
      // https://stackoverflow.com/a/31732581/6147893
      // normalizes date so it appears in local timezone
      .replace(/-/g, "/")
      .replace(/T.+/, "")
  )
  const formattedDate = format(date, "MM/dd/yyyy")
  return formattedDate
}

/**
 * Formats an iso date (such as one from OrderCloud)
 * to a user friendly creditcard date
 * ex: 02/24
 *
 * https://date-fns.org/v2.29.2/docs/format
 */
function formatCreditCardDate(isoDateString: string) {
  if (!isoDateString) {
    return
  }
  const date = new Date(isoDateString)
  const formattedDate = format(date, "MM/yy")
  return formattedDate
}
