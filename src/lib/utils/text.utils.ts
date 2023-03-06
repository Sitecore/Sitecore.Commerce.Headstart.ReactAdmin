export const textHelper = {
  stripHTML,
  formatTextTruncate,
  capitalizeFirstLetter,
  formatStatus,
  camelCaseToTitleCase
}

/**
 * Removes HTML from the passed string
 * ex:
 * Parameter: "<p>The Rocket III Project started in 1998 &NBSP; led by Triumph Product Range Manager Ross Clifford </p>"
 * Result:    "The Rocket III Project started in 1998 led by Triumph Product Range Manager Ross Clifford"
 * https://date-fns.org/v2.29.2/docs/format
 */
function stripHTML(myString: string) {
  const regex = /(&nbsp;|<([^>]+)>)/gi
  const strippedHTML = myString.replace(regex, "")
  return strippedHTML
}

function formatTextTruncate(len: number, str: string, ending: string): string {
  if (len == null) {
    len = 100
  }
  if (ending == null) {
    ending = "..."
  }
  return str
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1)
}

function formatStatus(status: string): string {
  switch (status) {
    case "Unsubmitted":
      return "Unsubmitted"
    case "AwaitingApproval":
      return "AwaitingApproval"
    case "Declined":
      return "Declined"
    case "Open":
      return "Open"
    case "Completed":
      return "Completed"
    case "Canceled":
      return "Canceled"
    default:
      return "Completed"
  }
}

// ex: JimBobJoe => Jim Bob Joe
function camelCaseToTitleCase(text: string): string {
  const withSpaces = text.replace(/([A-Z])/g, " $1")
  const capitalized = withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
  return capitalized
}
