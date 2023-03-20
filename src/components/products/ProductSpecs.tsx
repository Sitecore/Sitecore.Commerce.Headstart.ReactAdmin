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
  FormControl,
  HStack,
  Heading,
  Input,
  ListItem,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  UnorderedList,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react"
import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {ComposedProduct, GetComposedProduct} from "../../services/ordercloud.service"
import {Products, Spec, SpecProductAssignment, Specs} from "ordercloud-javascript-sdk"
import BrandedTable from "../branding/BrandedTable"
import React from "react"
import {useState} from "react"
import BrandedSpinner from "../branding/BrandedSpinner"
import {ISpec} from "types/ordercloud/ISpec"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductSpecs({composedProduct, setComposedProduct}: ProductDataProps) {
  const color = useColorModeValue("textColor.900", "textColor.100")
  const bg = useColorModeValue("brand.500", "brand.500")
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [expanded, setExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = React.useRef()
  const [newSpecifaction, setNewSpecification] = useState("")
  const [isLinking, setIsLinking] = useState(false)
  const [availableSpecs, setAvailableSpecs] = useState<Spec<any, any>[]>(null)
  const [isSpecChosen, setIsSpecChosen] = useState(false)
  const [regenerateVariants, setRegenerateVariants] = useState(false)

  const onRemoveSpecification = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const specId = e.currentTarget.dataset.id
    await Specs.DeleteProductAssignment(specId, composedProduct?.Product?.ID)

    var targetSpec = composedProduct?.Specs?.find((innerSpec) => innerSpec.ID == specId)
    if (targetSpec.DefinesVariant) {
      // TODO: ASK in Dialog if Variants shall be regenerated and how?
      // In case a variant spec has been deleted, all the variants have to be regenerated
      await Products.GenerateVariants(composedProduct?.Product?.ID, {
        overwriteExisting: true
      })
    }

    var product = await GetComposedProduct(composedProduct?.Product?.ID)
    setComposedProduct(product)
    setIsLoading(false)
  }

  const onSpecificationLink = async (e) => {
    setIsLinking(true)
    e.preventDefault()
    const specProductAssignment: SpecProductAssignment = {
      ProductID: composedProduct?.Product?.ID,
      SpecID: newSpecifaction
    }

    await Specs.SaveProductAssignment(specProductAssignment)
    var targetSpec = await Specs.Get<ISpec>(newSpecifaction)
    if (targetSpec.DefinesVariant && regenerateVariants) {
      // TODO: ASK in Dialog if Variants shall be regenerated and how?
      // In case a variant spec has been deleted, all the variants have to be regenerated
      await Products.GenerateVariants(composedProduct?.Product?.ID, {
        overwriteExisting: true
      })
    }

    var product = await GetComposedProduct(composedProduct?.Product?.ID)
    setComposedProduct(product)
    setIsLinking(false)
    setNewSpecification("")
    setAvailableSpecs(null)
    setExpanded(true)
    onClose()
  }

  const onAvailableSpecClick = (e) => {
    e.preventDefault()
    const chosenSpec = e.currentTarget.dataset.id
    setNewSpecification(chosenSpec)
    setIsSpecChosen(true)
  }

  const onSpecificationLinkInputChanged = (e) => {
    e.preventDefault()
    setIsSpecChosen(false)
    setNewSpecification(e.target.value)
    const availableSpecs = Specs.List<ISpec>({
      searchOn: ["Name", "ID"],
      search: e.target.value
    }).then((innerSpecs) => {
      const specIds = composedProduct?.Specs?.map((item) => {
        return item.ID
      })
      const filteredSpecs = innerSpecs.Items.filter((innerSpec) => !specIds.includes(innerSpec.ID))
      setAvailableSpecs(filteredSpecs)
    })
  }

  return (
    <>
      <>
        <Heading size={{base: "sm", md: "md", lg: "md"}}>Specs2</Heading>{" "}
        {(isLoading || !composedProduct?.Product) && expanded ? (
          <Box pt={6} textAlign={"center"}>
            Updating... <BrandedSpinner />
          </Box>
        ) : (
          <>
            <Box width="full" pb="50" pt={4}>
              {(composedProduct?.Specs?.length ?? 0) == 0 ? (
                <>No Specs</>
              ) : (
                <BrandedTable>
                  <Thead>
                    <Tr>
                      <Th color={color}>ID</Th>
                      <Th color={color}>Name</Th>
                      <Th color={color}>Number Options</Th>
                      <Th color={color}>Defines Variant</Th>
                      <Th color={color}>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody alignContent={"center"}>
                    {composedProduct?.Specs?.map((item, index) => {
                      return (
                        <Tr key={index}>
                          <Td>{item.ID}</Td>
                          <Td>{item.Name}</Td>
                          <Td>{item.OptionCount}</Td>
                          <Td>
                            {item.DefinesVariant ?? false ? (
                              <CheckIcon boxSize={6} color={okColor} />
                            ) : (
                              <CloseIcon boxSize={6} color={errorColor} />
                            )}
                          </Td>
                          <Td>
                            <ul>
                              {item?.Options?.map((item, index) => {
                                return (
                                  <li key={index}>
                                    {item.ID} | {item.Value}
                                  </li>
                                )
                              })}
                            </ul>
                          </Td>
                          <Td>
                            {" "}
                            <Tooltip label="Remove specification from Product">
                              <Button
                                colorScheme="brandButtons"
                                aria-label="Remove specification from Product"
                                variant="secondaryButton"
                                onClick={onRemoveSpecification}
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
        <Tooltip label="Add Product Specification">
          <Button
            colorScheme="brandButtons"
            aria-label="Add Product Specification"
            variant="tertiaryButton"
            onClick={onOpen}
          >
            Add Specs
          </Button>
        </Tooltip>
      </HStack>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        size={"5xl"}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            {isLinking ? (
              <AlertDialogHeader textAlign={"center"} fontSize="lg" fontWeight="bold">
                Linking... <BrandedSpinner />
              </AlertDialogHeader>
            ) : (
              <>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Link Specification to Product
                </AlertDialogHeader>

                <AlertDialogBody>Please choose Specification to link</AlertDialogBody>
                <FormControl ml={6}>
                  <Input
                    autoComplete="off"
                    justifyContent={"center"}
                    width={"90%"}
                    aria-label="Specification ID"
                    value={newSpecifaction}
                    onChange={onSpecificationLinkInputChanged}
                    onFocus={onSpecificationLinkInputChanged}
                    placeholder={"Enter and search for specs..."}
                  />
                </FormControl>
                <FormControl mt={2} pt={2}>
                  <Checkbox
                    ml={6}
                    id="remember"
                    name="remember"
                    isChecked={regenerateVariants}
                    onChange={(e) => {
                      setRegenerateVariants(e.target.checked)
                    }}
                    size="lg"
                    colorScheme={"purple"}
                  />
                  <Text ml={2} display={"inline-block"}>
                    Autoregenerate Variants?
                  </Text>
                </FormControl>
                {(availableSpecs?.length ?? 0) > 0 ? (
                  <>
                    <Box pt={4} pl={4} pb={4} m={6} border={"1px solid white"}>
                      <Heading as="h3" size="md" pb={3}>
                        Available Specs (Please choose...)
                      </Heading>
                      <UnorderedList>
                        {availableSpecs.map((element, key) => (
                          <Tooltip key={key} label={"Click to choose"}>
                            <ListItem
                              textDecor={"none"}
                              _hover={{textDecor: "underline"}}
                              cursor={"copy"}
                              onClick={onAvailableSpecClick}
                              data-id={element.ID}
                            >
                              <b>Name:</b> {element.Name} | <b>ID:</b> {element.ID}
                            </ListItem>
                          </Tooltip>
                        ))}
                      </UnorderedList>
                    </Box>
                  </>
                ) : null}
                <AlertDialogFooter>
                  <Box width={"full"}>
                    {isSpecChosen ? null : <Text pb={2}>Please choose from the search results to link a spec</Text>}
                    <Button width={"45%"} size={"md"} variant="tertiaryButton" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      float={"right"}
                      width={"45%"}
                      size={"md"}
                      variant="tertiaryButton"
                      onClick={onSpecificationLink}
                      ml={3}
                      disabled={!isSpecChosen}
                    >
                      Link
                    </Button>
                  </Box>
                </AlertDialogFooter>
              </>
            )}
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
