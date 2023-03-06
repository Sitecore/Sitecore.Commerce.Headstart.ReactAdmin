import {useColorMode, useColorModeValue, Box, TableContainer, Table} from "@chakra-ui/react"

export default function BrandedTable({children}) {
  const tableHeaderBg = useColorModeValue("white.000", "gray.900")
  const tableBg = useColorModeValue("brand.300", "brand.500")
  const tableColor = useColorModeValue("textColor.900", "textColor.100")
  const tableBorder = useColorModeValue("gray.400", "gray.400")

  return (
    <TableContainer
      width={"full"}
      rounded={20}
      //boxShadow={"md"}
      bg={tableHeaderBg}
      color={tableColor}
    >
      <Table variant="simple">{children}</Table>
    </TableContainer>
  )
}
