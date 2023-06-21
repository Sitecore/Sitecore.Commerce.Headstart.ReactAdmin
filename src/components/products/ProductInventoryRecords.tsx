import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue
} from "@chakra-ui/react"
import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {FiTrash2} from "react-icons/fi"
import {InventoryRecord, InventoryRecords} from "ordercloud-javascript-sdk"
import React, {useEffect} from "react"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"
import {ComposedProduct} from "../../services/ordercloud.service"
import {useState} from "react"
import {IInventoryRecord} from "types/ordercloud/IInventoryRecord"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductInventoryRecords({composedProduct, setComposedProduct}: ProductDataProps) {
  const color = useColorModeValue("textColor.900", "textColor.100")
  const bg = useColorModeValue("accent.500", "accent.500")
  const okColor = useColorModeValue("green.500", "green.300")
  const errorColor = useColorModeValue("red.500", "red.300")
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [inventoryRecors, setInventoryRecords] = useState<InventoryRecord[]>(null)

  useEffect(() => {
    async function GetProdcutSupplier() {
      if (composedProduct?.Product) {
        var productSupplier = await InventoryRecords.List<IInventoryRecord>(composedProduct?.Product?.ID)
        setInventoryRecords(productSupplier.Items)
      }
    }
    GetProdcutSupplier()
  }, [composedProduct])

  return (
    <>
      <>
        <Heading position={"relative"} size={{base: "sm", md: "md", lg: "md"}}>
          Inventory Records
        </Heading>

        {(isLoading || !composedProduct?.Product) && expanded ? (
          <Box pt={6} textAlign={"center"}>
            Updating... <BrandedSpinner />
          </Box>
        ) : (
          <>
            <Box width="full" pb="50" pt={4}>
              {(inventoryRecors?.length ?? 0) == 0 ? (
                <>No Inventory Records</>
              ) : (
                <BrandedTable>
                  <Thead>
                    <Tr>
                      <Th color={color}>ID</Th>
                      <Th color={color}>Quantity</Th>
                      <Th color={color}>Address</Th>
                      <Th color={color}>Last Updated</Th>
                      <Th color={color}>Order can exceed?</Th>
                      <Th color={color}>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody alignContent={"center"}>
                    {inventoryRecors?.map((item, index) => {
                      return (
                        <Tr key={index}>
                          <Td>{item.ID}</Td>
                          <Td>{item.QuantityAvailable}</Td>
                          <Td>
                            <Box>
                              <p>
                                <b>{item.Address.AddressName}</b>
                              </p>
                              <Divider variant={"solid"} />
                              <p>
                                {item.Address.FirstName} {item.Address.LastName}
                              </p>
                              <p>{item.Address.Street1}</p>
                              <p>
                                {item.Address.Zip} {item.Address.City}
                              </p>
                              <p>{item.Address.Country}</p>
                            </Box>
                          </Td>

                          <Td>{new Date(composedProduct?.Product?.Inventory?.LastUpdated)?.toLocaleString()}</Td>
                          <Td>
                            {item.OrderCanExceed ?? false ? (
                              <CheckIcon boxSize={6} color={okColor} />
                            ) : (
                              <CloseIcon boxSize={6} color={errorColor} />
                            )}
                          </Td>
                          <Td>
                            {" "}
                            <Tooltip label="Remove Inventory Record from Product">
                              <Button
                                aria-label="Remove Inventory Record from Product"
                                disabled={true}
                                colorScheme="secondary"
                                // onClick={onRemoveSpecification}
                                data-id={item.ID}
                              >
                                <FiTrash2 />
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
        <Tooltip label="Add Product Inventory">
          <Button
            aria-label="Add Product Inventory"
            colorScheme="secondary"
            disabled={true}
            // onClick={onOpen}
          >
            Add Inventory
          </Button>
        </Tooltip>
      </HStack>
    </>
  )
}
