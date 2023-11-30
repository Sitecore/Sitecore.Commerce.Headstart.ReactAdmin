export const textHelper = {
  stripHTML,
  formatTextTruncate,
  capitalizeFirstLetter,
  formatStatus
}

/**
 * Removes HTML from the passed string
 * ex:
 * Parameter: "<p>The Rocket III Project started in 1998 &NBSP; led by Triumph Product Range Manager Ross Clifford </p>"
 * Result:    "The Rocket III Project started in 1998 led by Triumph Product Range Manager Ross Clifford"
 * https://date-fns.org/v2.29.2/docs/format
 */
function stripHTML(myString?: string) {
  if (!myString) {
    return ""
  }
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
