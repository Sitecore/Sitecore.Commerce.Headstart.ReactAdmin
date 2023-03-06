import axios from "axios"
import {ordercloudErrorService} from "./ordercloud-error.service"

export const axiosService = {
  initializeInterceptors
}

function initializeInterceptors() {
  // Add a response interceptor
  axios.interceptors.response.use(
    (response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response
    },
    (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      ordercloudErrorService.handleError(error)
      return Promise.reject(error)
    }
  )
}
