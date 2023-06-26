import {AxiosError} from "axios"
import {createStandaloneToast} from "@chakra-ui/react"
import theme from "../theme/theme"
const {toast} = createStandaloneToast({theme})

export const ordercloudErrorService = {
  handleError
}

function handleError(error: AxiosError) {
  logDetailsInternally(error)
  const message = getUserFacingErrorMessage(error)
  const id = getMessageId(message)
  if (!toast.isActive(id)) {
    toast({
      id,
      title: "Error",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
      position: "top"
    })
  }
}

/**
 * logs full details to console, useful for debugging
 */
function logDetailsInternally(apiError: AxiosError) {
  if (apiError.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(`OrderCloud API call failed: ${apiError.response.config.method} ${apiError.response.config.url}`)
    if (apiError.response.config.data) {
      console.error(`Request body: ${apiError.response.config.data}`)
    }
    var orderCloudErrors = (apiError.response.data as any).Errors
    if (orderCloudErrors.length) {
      console.error(`Response body: ${JSON.stringify(orderCloudErrors, null, 4)}`)
    }
  } else if (apiError.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(`The request was made but no response was received`)
    console.error(apiError.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error((apiError as any)?.message || "An unknown error occurred")
  }
}

function getUserFacingErrorMessage(apiError: AxiosError) {
  let message = "An unknown error occurred"
  if (apiError.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    var orderCloudErrors = (apiError.response.data as any).Errors
    if (orderCloudErrors.length) {
      const firstError = orderCloudErrors[0] // there's almost only just one error
      message = firstError.Message
      if (firstError.ErrorCode === "NotFound") {
        // enhance with detailed information about which entity was not found
        message = `${firstError.Data.ObjectType} "${firstError.Data.ObjectID}" not found.`
      }
    }
  } else if (apiError.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(`The request was made but no response was received`)
    console.error(apiError.request)
  } else {
    console.error((apiError as any)?.message || "An unknown error occurred")
  }

  if (message === "Access token is invalid or expired.") {
    message = "Your session has expired. Please log in." // user friendly message
  }
  return message
}

function getMessageId(message: string) {
  // generate a message id that will guard against duplicate messages within a second
  const nowInMilliseconds = new Date().getTime() / 1000
  const nowInSeconds = Math.floor(nowInMilliseconds)
  return message + nowInSeconds
}
