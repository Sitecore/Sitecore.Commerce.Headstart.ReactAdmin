import {
  Box,
  Button,
  HStack,
  Heading,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  Switch
} from "@chakra-ui/react"
import {ProductSupplier, Products} from "ordercloud-javascript-sdk"
import React, {useEffect} from "react"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"
import {ComposedProduct} from "../../services/ordercloud.service"
import {useState} from "react"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductSuppliers({composedProduct, setComposedProduct}: ProductDataProps) {
  const color = useColorModeValue("textColor.900", "textColor.100")
  const bg = useColorModeValue("accent.500", "accent.500")
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [supplier, setSupplier] = useState<ProductSupplier[]>(null)

  useEffect(() => {
    async function GetProdcutSupplier() {
      if (composedProduct?.Product) {
        var productSupplier = await Products.ListSuppliers(composedProduct?.Product?.ID)
        setSupplier(productSupplier.Items)
      }
    }
    GetProdcutSupplier()
  }, [composedProduct])

  return (
    <>
      <>
        <Heading position={"relative"} size={{base: "sm", md: "md", lg: "md"}}>
          Supplier
        </Heading>

        {(isLoading || !composedProduct?.Product) && expanded ? (
          <Box pt={6} textAlign={"center"}>
            Updating... <BrandedSpinner />
          </Box>
        ) : (
          <>
            <Box width="full" pb="50" pt={4}>
              {(supplier?.length ?? 0) == 0 ? (
                <>No Supplier</>
              ) : (
                <BrandedTable>
                  <Thead>
                    <Tr>
                      <Th color={color}>ID</Th>
                      <Th color={color}>Name</Th>
                      <Th color={color}>Is Active</Th>
                      <Th color={color}>All Buyers can Order</Th>
                      <Th color={color}>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody alignContent={"center"}>
                    {supplier?.map((item, index) => {
                      return (
                        <Tr key={index}>
                          <Td>{item.ID}</Td>
                          <Td>{item.Name}</Td>
                          <Td>
                            <Switch isChecked={item.Active} isReadOnly colorScheme="teal" />
                          </Td>
                          <Td>
                            <Switch isChecked={item.AllBuyersCanOrder} isReadOnly colorScheme="teal" />
                          </Td>
                          <Td>
                            {" "}
                            <Tooltip label="Remove Supplier from Product">
                              <Button
                                aria-label="Remove Supplier from Product"
                                disabled={true}
                                variant="outline"
                                // onClick={onRemoveSpecification}
                                data-id={item.ID}
                              >
                                Delete
                              </Button>
                            </Tooltip>
                          </Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                </BrandedTable>
              )}
            </Box>
          </>
        )}
      </>
      <HStack float={"right"} position="absolute" bottom="20px">
        <Tooltip label="Add Product Supplier">
          <Button
            aria-label="Add Product Supplier"
            colorScheme="secondary"
            disabled={true}
            // onClick={onOpen}
          >
            Add Supplier
          </Button>
        </Tooltip>
      </HStack>
    </>
  )
}
