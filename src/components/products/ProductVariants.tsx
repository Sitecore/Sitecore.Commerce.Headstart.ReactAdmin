import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Checkbox,
  Collapse,
  HStack,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorMode,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react"
import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {ComposedProduct, GetComposedProduct} from "../../services/ordercloud.service"
import {FiMinus, FiPlus, FiRefreshCw, FiTrash2, FiZap} from "react-icons/fi"
import {Product, Products, RequiredDeep, Variant} from "ordercloud-javascript-sdk"

import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"
import React from "react"
import {useState} from "react"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct?: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductVariants({composedProduct, setComposedProduct}: ProductDataProps) {
  const {colorMode, toggleColorMode} = useColorMode()
  const color = useColorModeValue("textColor.900", "textColor.100")
  const gradient =
    colorMode === "light" ? "linear(to-t, accent.300, accent.400)" : "linear(to-t, accent.600, accent.500)"
  const shadow = "5px 5px 5px #999999"
  const okColor = useColorModeValue("green.500", "green.300")
  const errorColor = useColorModeValue("red.500", "red.300")
  const [expanded, setExpanded] = useState(false)
  const [overwriteExistingVariants, setOverwriteExistingVariants] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = React.useRef()

  const onGenerateVariantsClicked = async (e) => {
    setIsGenerating(true)
    e.preventDefault()
    await Products.GenerateVariants(composedProduct?.Product?.ID, {
      overwriteExisting: overwriteExistingVariants
    })
    var product = await GetComposedProduct(composedProduct?.Product?.ID)
    setComposedProduct(product)
    setIsGenerating(false)
    onClose()
    setExpanded(true)
  }

  const onVariantStatusChange = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const variantId = e.currentTarget.dataset.id
    let variant = composedProduct?.Variants?.find((element) => element.ID == variantId)
    const newVariant: Variant<any> = {
      Active: !variant.Active,
      ID: variant.ID
    }
    await Products.PatchVariant(composedProduct?.Product?.ID, variantId, newVariant)
    var product = await GetComposedProduct(composedProduct?.Product?.ID)
    setComposedProduct(product)
    setIsLoading(false)
  }

  return (
    <>
      {" "}
      <>
        <Heading size={{base: "sm", md: "md", lg: "md"}}>Variants</Heading>
        {(isLoading || !composedProduct?.Product) && expanded ? (
          <Box pt={6} textAlign={"center"}>
            Updating... <BrandedSpinner />
          </Box>
        ) : (
          <>
            <Box width="full" pb="50" pt={4}>
              {composedProduct?.Variants?.length ?? 0 > 0 ? (
                <>
                  <BrandedTable>
                    <Thead>
                      <Tr>
                        <Th color={color}>ID</Th>
                        <Th color={color}>Name</Th>
                        <Th color={color}>Is Active?</Th>
                        <Th color={color}>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody alignContent={"center"}>
                      {composedProduct?.Variants ? (
                        <>
                          {composedProduct?.Variants.map((item, index) => {
                            return (
                              <Tr key={index}>
                                <Td>{item.ID}</Td>
                                <Td>{item.Name}</Td>
                                <Td>
                                  {" "}
                                  {item?.Active ?? false ? (
                                    <CheckIcon boxSize={6} color={okColor} />
                                  ) : (
                                    <CloseIcon boxSize={6} color={errorColor} />
                                  )}
                                </Td>
                                <Td>
                                  {item?.Active ?? false ? (
                                    <Tooltip label="Deactivate Variant">
                                      <Button
                                        aria-label="Deactivate variant"
                                        onClick={onVariantStatusChange}
                                        colorScheme="secondary"
                                        data-id={item.ID}
                                      >
                                        <FiMinus />
                                      </Button>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip label="Activate Variant">
                                      <Button
                                        aria-label="Activate Variant"
                                        onClick={onVariantStatusChange}
                                        colorScheme="secondary"
                                        data-id={item.ID}
                                      >
                                        <FiPlus />
                                      </Button>
                                    </Tooltip>
                                  )}
                                </Td>
                              </Tr>
                            )
                          })}
                        </>
                      ) : (
                        <>No Variants</>
                      )}
                    </Tbody>
                  </BrandedTable>
                </>
              ) : (
                <>No Variants</>
              )}
            </Box>
          </>
        )}
      </>
      <HStack float={"right"} position="absolute" bottom="20px">
        <Tooltip label="Generate variants">
          <Button aria-label="Generate Variants" colorScheme="secondary" onClick={onOpen}>
            Create Variant
          </Button>
        </Tooltip>
      </HStack>
      <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            {isGenerating ? (
              <AlertDialogHeader textAlign={"center"} fontSize="lg" fontWeight="bold">
                Generating... <BrandedSpinner />
              </AlertDialogHeader>
            ) : (
              <>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Generate Variants
                </AlertDialogHeader>

                <AlertDialogBody>Would you like to overwrite existing Variants?</AlertDialogBody>
                <Checkbox
                  mx={6}
                  mb={2}
                  aria-label="Overwrite Existing Variants?"
                  isChecked={overwriteExistingVariants}
                  onChange={(e) => {
                    setOverwriteExistingVariants(e.target.checked)
                  }}
                />
                <AlertDialogFooter>
                  <Button colorScheme="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={onGenerateVariantsClicked} colorScheme="secondary" ml={3}>
                    Generate
                  </Button>
                </AlertDialogFooter>
              </>
            )}
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
