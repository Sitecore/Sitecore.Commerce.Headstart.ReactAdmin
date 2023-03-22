import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Collapse,
  FormControl,
  HStack,
  Heading,
  Input,
  ListItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  UnorderedList,
  useColorMode,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react"
import {Catalog, Catalogs, ProductCatalogAssignment} from "ordercloud-javascript-sdk"
import {ComposedProduct, GetComposedProduct} from "../../services/ordercloud.service"
import {useEffect, useState} from "react"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"
import ProductCategoryAssignments from "./ProductCategoryAssignments"
import React from "react"
import {ICatalog} from "types/ordercloud/ICatalog"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductCatalogAssignments({composedProduct, setComposedProduct}: ProductDataProps) {
  const [productCatalogAssignments, setProductCatalogAssignments] = useState<Catalog[]>(null)
  const [chosenCatalog, setChosenCatalog] = useState<Catalog>(null)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = React.useRef()
  const [isLinking, setIsLinking] = useState(false)
  const [availableCatalogs, setAvailableCatalogs] = useState<Catalog<any>[]>(null)
  const [isCatalogChosen, setIsCatalogChosen] = useState(false)
  const [newCatalog, setNewCatalog] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const color = useColorModeValue("textColor.900", "textColor.100")
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    async function GetProductCatalogAssignments() {
      if (composedProduct?.Product) {
        setIsLoading(true)
        let catalogs: Catalog[] = []
        const assignments = await Catalogs.ListProductAssignments({
          catalogID: "",
          productID: composedProduct.Product?.ID
        })

        await Promise.all(
          assignments.Items.map(async (index) => {
            var catalog = await Catalogs.Get<ICatalog>(index.CatalogID)
            catalogs.push(catalog)
          })
        )

        setProductCatalogAssignments(catalogs)
        setIsLoading(false)
      }
    }
    GetProductCatalogAssignments()
  }, [composedProduct?.Product])

  const onCategoriesExpandedClick = async (e) => {
    const chosenCatalogId = e.currentTarget.dataset.id
    const newValue = chosenCatalogId == (chosenCatalog?.ID ?? "") ? "" : chosenCatalogId
    if (newValue == "") {
      setChosenCatalog(null)
    } else {
      var catalog = await Catalogs.Get<ICatalog>(newValue)
      setChosenCatalog(catalog)
    }
  }

  const onRemoveCatalog = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const catalogId = e.currentTarget.dataset.id
    await Catalogs.DeleteProductAssignment(catalogId, composedProduct?.Product?.ID)
    var product = await GetComposedProduct(composedProduct?.Product?.ID)
    setComposedProduct(product)
    setChosenCatalog(null)
    setIsLoading(false)
  }

  const onCatalogLink = async (e) => {
    setIsLinking(true)
    e.preventDefault()
    const catalogAssignment: ProductCatalogAssignment = {
      CatalogID: newCatalog,
      ProductID: composedProduct?.Product?.ID
    }

    await Catalogs.SaveProductAssignment(catalogAssignment)

    var product = await GetComposedProduct(composedProduct?.Product?.ID)
    setComposedProduct(product)
    setIsLinking(false)
    setNewCatalog("")
    setAvailableCatalogs(null)
    setExpanded(true)
    onClose()
  }

  const onAvailableCatalogClick = (e) => {
    e.preventDefault()
    const chosenCatalog = e.currentTarget.dataset.id
    setNewCatalog(chosenCatalog)
    setIsCatalogChosen(true)
  }

  const onCatalogLinkInputChanged = (e) => {
    e.preventDefault()
    setIsCatalogChosen(false)
    setNewCatalog(e.target.value)
    Catalogs.List<ICatalog>({
      searchOn: ["Name", "ID"],
      search: e.target.value
    }).then((innerAvailableCatalogs) => {
      const catalogIds = productCatalogAssignments.map((item) => {
        return item.ID
      })
      const filteredCatalogs = innerAvailableCatalogs.Items.filter(
        (innerCatalog) => !catalogIds.includes(innerCatalog.ID)
      )
      setAvailableCatalogs(filteredCatalogs)
    })
  }

  return (
    <>
      <>
        <Heading size={{base: "sm", md: "md", lg: "md"}}>Catalog Assignments</Heading>
        {!composedProduct && expanded ? (
          <Box pt={6} textAlign={"center"}>
            Updating... <BrandedSpinner />
          </Box>
        ) : (
          <Collapse in={expanded}>
            <Box width="full" pb="50" pt={4}>
              {/* <Text opacity={0.5} fontWeight={"bold"}>
            Assignments
          </Text> */}
              {productCatalogAssignments?.length ?? 0 > 0 ? (
                <>
                  <BrandedTable>
                    <Thead>
                      <Tr>
                        <Th color={color}>ID</Th>
                        <Th color={color}>Name</Th>
                        <Th color={color}>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody alignContent={"center"}>
                      {productCatalogAssignments ? (
                        <>
                          {productCatalogAssignments.map((item, index) => {
                            return (
                              <Tr key={index}>
                                <Tooltip label="Click to see categories">
                                  <Td
                                    data-id={item.ID}
                                    onClick={onCategoriesExpandedClick}
                                    _hover={{
                                      textDecor: "underline",
                                      cursor: "pointer"
                                    }}
                                  >
                                    {item.ID}
                                  </Td>
                                </Tooltip>
                                <Td>{item.Name}</Td>
                                <Td>
                                  {" "}
                                  <Tooltip label="Remove from Catalog">
                                    <Button
                                      variant="outline"
                                      aria-label="remove from catalog"
                                      onClick={onRemoveCatalog}
                                      data-id={item.ID}
                                    >
                                      Delete
                                    </Button>
                                  </Tooltip>
                                </Td>
                              </Tr>
                            )
                          })}
                        </>
                      ) : (
                        <Text p={4}>No Assignments</Text>
                      )}
                    </Tbody>
                  </BrandedTable>
                </>
              ) : (
                <Text p={4}>No Assignments</Text>
              )}
            </Box>
            {chosenCatalog ? (
              <ProductCategoryAssignments product={composedProduct?.Product} catalog={chosenCatalog} />
            ) : (
              <></>
            )}
          </Collapse>
        )}
      </>
      <HStack float={"right"} position="absolute" bottom="20px">
        <Tooltip label="Add to catalog">
          <Button colorScheme="secondary" aria-label="add to catalog" onClick={onOpen}>
            Add to Catalog
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
                  Link a Catalog to Product
                </AlertDialogHeader>

                <AlertDialogBody>Please choose Catalog to link</AlertDialogBody>
                <FormControl ml={6}>
                  <Input
                    autoComplete="off"
                    justifyContent={"center"}
                    width={"90%"}
                    aria-label="Catalog ID"
                    value={newCatalog}
                    onChange={onCatalogLinkInputChanged}
                    onFocus={onCatalogLinkInputChanged}
                    placeholder={"Enter and search for Catalogs..."}
                  />
                </FormControl>
                {(availableCatalogs?.length ?? 0) > 0 ? (
                  <>
                    <Box pt={4} pl={4} pb={4} m={6} border={"1px solid white"}>
                      <Heading as="h3" size="md" pb={3}>
                        Available Catalogs (Please choose...)
                      </Heading>
                      <UnorderedList>
                        {availableCatalogs.map((element, key) => (
                          <Tooltip key={key} label={"Click to choose"}>
                            <ListItem
                              textDecor={"none"}
                              _hover={{textDecor: "underline"}}
                              cursor={"copy"}
                              onClick={onAvailableCatalogClick}
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
                    {isCatalogChosen ? null : (
                      <Text pb={2}>Please choose from the search results to link a Catalog</Text>
                    )}
                    <Button width={"45%"} size={"md"} onClick={onClose} colorScheme="secondary">
                      Cancel
                    </Button>
                    <Button
                      float={"right"}
                      width={"45%"}
                      size={"md"}
                      colorScheme="secondary"
                      onClick={onCatalogLink}
                      ml={3}
                      disabled={!isCatalogChosen}
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
