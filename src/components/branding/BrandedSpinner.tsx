import {Spinner, useColorModeValue} from "@chakra-ui/react"

export default function BrandedSpinner() {
  const spinnerColor = useColorModeValue("brand.200", "brand.600")

  return <Spinner color={spinnerColor} size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" />
}
