import {Spinner, useColorModeValue} from "@chakra-ui/react"

export default function BrandedSpinner() {
  const spinnerColor = useColorModeValue("accent.200", "accent.600")

  return <Spinner color={spinnerColor} size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" />
}
