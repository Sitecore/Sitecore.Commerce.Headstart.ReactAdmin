import {useToast as useChakraToast, UseToastOptions} from "@chakra-ui/toast"

const globalToastOptions: UseToastOptions = {
  duration: 9000,
  isClosable: true,
  position: "top"
}

export const useToast = () => {
  return useChakraToast(globalToastOptions)
}

export const useSuccessToast = () => {
  return useChakraToast({...globalToastOptions, title: "Success", status: "success"})
}

export const useErrorToast = () => {
  return useChakraToast({...globalToastOptions, title: "Error", status: "error"})
}
