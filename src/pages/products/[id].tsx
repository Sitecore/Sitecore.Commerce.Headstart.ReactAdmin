import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  HStack,
  VStack,
  Menu,
  useDisclosure,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  CheckboxGroup,
  Divider,
  Text,
  SimpleGrid,
  Spinner,
  Select,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter
} from "@chakra-ui/react"
import {ComposedProduct, GetComposedProduct} from "services/ordercloud.service"
import {ChangeEvent, useEffect, useState} from "react"
import BrandedSpinner from "components/branding/BrandedSpinner"
import EditorialProgressBar from "components/products/EditorialProgressBar"
import {NextSeo} from "next-seo"
import ProductCatalogAssignments from "components/products/ProductCatalogAssignments"
import ProductData from "components/products/ProductData"
import ProductInventoryData from "components/products/ProductInventoryData"
import ProductInventoryRecords from "components/products/ProductInventoryRecords"
import ProductMeasurementData from "components/products/ProductMeasurementData"
import ProductMediaInformation from "components/products/ProductMediaInformation"
import ProductPriceScheduleAssignments from "components/products/ProductPriceScheduleAssignments"
import ProductSpecs from "components/products/ProductSpecs"
import ProductSuppliers from "components/products/ProductSupllier"
import ProductVariants from "components/products/ProductVariants"
import ProductXpCards from "components/products/ProductXpCards"
import {Product, Products} from "ordercloud-javascript-sdk"
import ProtectedContent from "components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "constants/app-permissions.config"
import {useRouter} from "next/router"
import Card from "components/card/Card"
import {ChevronDownIcon} from "@chakra-ui/icons"
import {useSuccessToast} from "hooks/useToast"
import {Link} from "components/navigation/Link"
import {IProduct} from "types/ordercloud/IProduct"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Product Detail Page:",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const ProductDetails = () => {
  const router = useRouter()
  const successToast = useSuccessToast()
  const {isOpen: isOpenAddProduct, onOpen: onOpenAddProduct, onClose: onCloseAddProduct} = useDisclosure()
  const [selectedLanguage, setselectedLanguage] = useState("")
  const {id} = router.query
  const [composedProduct, setComposedProduct] = useState<ComposedProduct>(null)
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const [isViewProductDialogOpen, setViewProductDialogOpen] = useState(false)
  const [isDeleteProductDialogOpen, setDeleteProductDialogOpen] = useState(false)
  const [isLanguageDialogOpen, setLanguageDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [productName, setProductName] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = React.useRef()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  const [formValues, setFormValues] = useState({
    id: "",
    name: "",
    description: "",
    isActive: false,
    isInactive: false
  })

  const onDelete = (e) => {
    setIsDeleting(true)
    e.preventDefault()
    Products.Delete(composedProduct?.Product?.ID)
    setTimeout(() => {
      setIsDeleting(false)
      onClose()
      router.push("/products")
    }, 4000)
  }

  const requestExportCSV = () => {}
  const requestViewProduct = () => {}
  const requestDeleteProduct = () => {}
  const requestLanguage = () => {}

  const handleInputChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({...v, [fieldKey]: e.target.value}))
  }

  const handleCheckboxChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    if (fieldKey == "isActive" && formValues["isInactive"]) {
      setFormValues((v) => ({...v, ["isInactive"]: false}))
    } else if (fieldKey == "isInactive" && formValues["isActive"]) {
      setFormValues((v) => ({...v, ["isActive"]: false}))
    }
    setFormValues((v) => ({...v, [fieldKey]: !!e.target.checked}))
  }

  // TODO Add more properties in Add handling
  const onProductAdd = async (e) => {
    if (formValues.id == "" || formValues.name == "") {
      successToast({
        title: "Missing Properties",
        description: "Please fill out ID and NAME to add the product"
      })
      return
    }

    setIsAdding(true)
    e.preventDefault()
    const newProduct: Product = {
      Name: formValues.name,
      Description: formValues.description,
      ID: formValues.id,
      Active: formValues.isActive
    }
    await Products.Create<IProduct>(newProduct)

    setFormValues((v) => ({
      ...v,
      ["isActive"]: false,
      ["isInactive"]: false,
      ["name"]: "",
      ["id"]: "",
      ["description"]: ""
    }))

    setTimeout(() => {
      onCloseAddProduct()
      //setReload(true)
      setIsAdding(false)
      setFormValues((v) => ({
        ...v,
        ["isActive"]: false,
        ["isInactive"]: false,
        ["name"]: "",
        ["id"]: "",
        ["description"]: ""
      }))
    }, 5000)
  }

  useEffect(() => {
    async function LoadProduct() {
      var product = await GetComposedProduct(id as string)
      if (product?.Product && composedProduct?.Product?.ID != product.Product.ID) {
        setComposedProduct(product)
      }
    }

    LoadProduct()

    setProductName(composedProduct?.Product?.Name ?? "")
  }, [composedProduct, id])

  return (
    <VStack w="full">
      <>
        {/* {productName !== "" ? ( */}
        <>
          <NextSeo title={productName} />
          <HStack position="absolute" right="30px" top="67px">
            <EditorialProgressBar product={composedProduct?.Product} />
          </HStack>
          <HStack justifyContent="space-between" w="100%" pl="10px" pr="15px">
            <HStack justifyContent="space-between" w="100%" mr="208px">
              <Box>
                <Link href="" onClick={onOpenAddProduct} pr="10px">
                  <Button variant="primaryButton">Create Product</Button>
                </Link>
                <Button variant="secondaryButton" onClick={() => setViewProductDialogOpen(true)}>
                  View Product
                </Button>
              </Box>
              <Button variant="secondaryButton" onClick={() => setDeleteProductDialogOpen(true)}>
                Delete Product
              </Button>
            </HStack>
            <HStack>
              <Menu>
                <MenuButton
                  px={4}
                  py={2}
                  transition="all 0.2s"
                  borderRadius="md"
                  borderWidth="1px"
                  _hover={{bg: "gray.400"}}
                  _expanded={{bg: "blue.400"}}
                  _focus={{boxShadow: "outline"}}
                >
                  <HStack>
                    <Text>Views </Text>
                    <ChevronDownIcon />
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    <VStack>
                      <Text>Manage Product Views</Text>
                      <CheckboxGroup>
                        <SimpleGrid columns={3} spacing={3}>
                          <Checkbox value="ProductData" defaultChecked>
                            Product Data
                          </Checkbox>
                          <Checkbox value="Media" defaultChecked>
                            Media
                          </Checkbox>
                          <Checkbox value="ExtededProperties" defaultChecked>
                            Extended Properties
                          </Checkbox>
                          <Checkbox value="CatalogAssignments">Catalog Assignments</Checkbox>
                          <Checkbox value="Inventory">Inventory</Checkbox>
                          <Checkbox value="PriceSchedule">Price Schedule</Checkbox>
                          <Checkbox value="Suppliers">Suppliers</Checkbox>
                          <Checkbox value="Sizes">Sizes</Checkbox>
                          <Checkbox value="Specs">Specs</Checkbox>
                          <Checkbox value="Variants">Variants</Checkbox>
                          <Checkbox value="InventoryRecords">Inventory Records</Checkbox>
                        </SimpleGrid>
                      </CheckboxGroup>
                      <Divider />
                      <HStack>
                        {/*<Button size="md" bg={boxBgColor} color={color}>
                      Clear
                    </Button>
                  <Button size="md" bg={boxBgColor} color={color}>
                      Submit
                    </Button> */}
                      </HStack>
                    </VStack>
                  </MenuItem>
                </MenuList>
              </Menu>
              <Button variant="secondaryButton" onClick={() => setLanguageDialogOpen(true)}>
                Languages
              </Button>
              <Button variant="secondaryButton" onClick={() => setExportCSVDialogOpen(true)}>
                Export CSV
              </Button>
            </HStack>
          </HStack>
          <VStack justifyContent={"space-between"} width={"full"}>
            <Container maxW={"full"} p="10px">
              <Grid
                templateRows={{
                  base: "repeat(1, 1fr)",
                  md: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                  lg: "repeat(1, 1fr)"
                }}
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  md: "repeat(3, 1fr)",
                  sm: "repeat(3, 1fr)",
                  lg: "repeat(6, 1fr)"
                }}
                gap={8}
                mt={8}
                // gridGap={{base: 4, sm: 4, md: 8, lg: 8}}
              >
                <GridItem rowSpan={1} colSpan={{base: 6, md: 6, sm: 6, lg: 6, xl: 4}}>
                  <Card variant="primaryCard" h={"100%"} closedText="Product Data">
                    <ProductData composedProduct={composedProduct} setComposedProduct={setComposedProduct} />
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={{base: 6, md: 6, sm: 6, lg: 2, xl: 2}}>
                  <Card variant="primaryCard" h={"100%"} closedText="Media">
                    <ProductMediaInformation
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={2}>
                  <Card variant="primaryCard" h={"100%"} closedText="Extended Properties Cards">
                    <ProductXpCards composedProduct={composedProduct} setComposedProduct={setComposedProduct} />
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={{base: 6, md: 6, sm: 6, lg: 4, xl: 2}}>
                  <Card variant="primaryCard" h={"100%"} closedText="Catalog Assignments">
                    <ProductCatalogAssignments
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={{base: 6, md: 6, sm: 6, lg: 4, xl: 2}}>
                  <Card variant="primaryCard" h={"100%"} closedText="Inventory">
                    <ProductInventoryData composedProduct={composedProduct} setComposedProduct={setComposedProduct} />
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={6}>
                  <Card variant="primaryCard" h={"100%"} closedText="Price Schedules">
                    <ProductPriceScheduleAssignments
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={{base: 6, md: 6, sm: 6, lg: 6, xl: 4}}>
                  <Card variant="primaryCard" h={"100%"} closedText="Supplier">
                    <ProductSuppliers composedProduct={composedProduct} setComposedProduct={setComposedProduct} />
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={{base: 6, md: 6, sm: 6, lg: 3, xl: 2}}>
                  <Card variant="primaryCard" h={"100%"} closedText="Sizes">
                    <ProductMeasurementData composedProduct={composedProduct} setComposedProduct={setComposedProduct} />
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={4}>
                  <Card variant="primaryCard" h={"100%"} closedText="Specs">
                    <ProductSpecs composedProduct={composedProduct} setComposedProduct={setComposedProduct} />
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={2}>
                  <Card variant="primaryCard" h={"100%"} closedText="Variants">
                    <ProductVariants composedProduct={composedProduct} setComposedProduct={setComposedProduct} />
                  </Card>
                </GridItem>
                <GridItem rowSpan={1} colSpan={{base: 6, md: 6, sm: 6, lg: 6, xl: 6}}>
                  <Card variant="primaryCard" h={"100%"} closedText="Inventory Records">
                    <ProductInventoryRecords
                      composedProduct={composedProduct}
                      setComposedProduct={setComposedProduct}
                    />
                  </Card>
                </GridItem>
              </Grid>
            </Container>
          </VStack>
        </>

        <AlertDialog motionPreset="slideInBottom" leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              {isDeleting ? (
                <AlertDialogHeader textAlign={"center"} fontSize="lg" fontWeight="bold">
                  Deleting... <BrandedSpinner />
                </AlertDialogHeader>
              ) : (
                <>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Product
                  </AlertDialogHeader>

                  <AlertDialogBody>Are you sure? You can&apos;t undo this action afterwards.</AlertDialogBody>

                  <AlertDialogFooter>
                    <Button variant="tertiaryButton" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button variant="tertiaryButton" colorScheme="red" onClick={onDelete} ml={3}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </>
              )}
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <AlertDialog
          isOpen={isExportCSVDialogOpen}
          onClose={() => setExportCSVDialogOpen(false)}
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Export Selected Product to CSV
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text display="inline">
                  Export the selected product to a CSV, once the export button is clicked behind the scenes a job will
                  be kicked off to create the csv and then will automatically download to your downloads folder in the
                  browser.
                </Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <HStack justifyContent="space-between" w="100%">
                  <Button
                    ref={cancelRef}
                    onClick={() => setExportCSVDialogOpen(false)}
                    disabled={loading}
                    variant="secondaryButton"
                  >
                    Cancel
                  </Button>
                  <Button onClick={requestExportCSV} disabled={loading}>
                    {loading ? <Spinner color="brand.500" /> : "Export Product"}
                  </Button>
                </HStack>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <AlertDialog
          isOpen={isViewProductDialogOpen}
          onClose={() => setViewProductDialogOpen(false)}
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                View Product
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text display="inline">View what this product will look like on a product details page.</Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <HStack justifyContent="space-between" w="100%">
                  <Button
                    ref={cancelRef}
                    onClick={() => setViewProductDialogOpen(false)}
                    disabled={loading}
                    variant="secondaryButton"
                  >
                    Cancel
                  </Button>
                  <Button onClick={requestViewProduct} disabled={loading}>
                    {loading ? <Spinner color="brand.500" /> : "View Product"}
                  </Button>
                </HStack>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <AlertDialog
          isOpen={isDeleteProductDialogOpen}
          onClose={() => setDeleteProductDialogOpen(false)}
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Product
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text display="inline">Are you sure you want to delete this product?</Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <HStack justifyContent="space-between" w="100%">
                  <Button
                    ref={cancelRef}
                    onClick={() => setDeleteProductDialogOpen(false)}
                    disabled={loading}
                    variant="secondaryButton"
                  >
                    Cancel
                  </Button>
                  <Button onClick={requestDeleteProduct} disabled={loading}>
                    {loading ? <Spinner color="brand.500" /> : "Confirm Delete Product"}
                  </Button>
                </HStack>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <AlertDialog
          isOpen={isLanguageDialogOpen}
          onClose={() => setLanguageDialogOpen(false)}
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Change Language
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text display="inline">Would you like to switch to a different language?</Text>
                <Select title="Select promotion" mt="20px" value={selectedLanguage}>
                  <option key="english" value="english">
                    English
                  </option>
                  <option key="french" value="french">
                    French
                  </option>
                  <option key="german" value="german">
                    German
                  </option>
                  <option key="chinese" value="chinese">
                    Chinese
                  </option>
                </Select>
              </AlertDialogBody>
              <AlertDialogFooter>
                <HStack justifyContent="space-between" w="100%">
                  <Button
                    ref={cancelRef}
                    onClick={() => setLanguageDialogOpen(false)}
                    disabled={loading}
                    variant="secondaryButton"
                  >
                    Cancel
                  </Button>
                  <Button onClick={requestLanguage} disabled={loading}>
                    {loading ? <Spinner color="brand.500" /> : "Change Language"}
                  </Button>
                </HStack>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <Modal isOpen={isOpenAddProduct} onClose={onCloseAddProduct}>
          <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
          <ModalContent>
            {isAdding ? (
              <ModalHeader textAlign={"center"}>
                Adding... <BrandedSpinner />
              </ModalHeader>
            ) : (
              <>
                <ModalHeader>Add a new Product</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel>ID*</FormLabel>
                    <Input
                      autoComplete="off"
                      placeholder="123456"
                      value={formValues.id}
                      onChange={handleInputChange("id")}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Name*</FormLabel>
                    <Input
                      autoComplete="off"
                      placeholder="New Product"
                      value={formValues.name}
                      onChange={handleInputChange("name")}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Description</FormLabel>
                    <Input
                      autoComplete="off"
                      placeholder="Lorem Ipsum Dolor..."
                      value={formValues.description}
                      onChange={handleInputChange("description")}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Is Active</FormLabel>
                    <Checkbox value={formValues.isActive ? 1 : 0} onChange={handleCheckboxChange("setIsActive")} />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <HStack justifyContent="space-between" w="100%">
                    <Button onClick={onCloseAddProduct} variant="secondaryButton">
                      Cancel
                    </Button>
                    <Button colorScheme="purple" mr={3} onClick={onProductAdd} variant="primaryButton">
                      Add
                    </Button>
                  </HStack>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </VStack>
  )
}

const ProtectedProductDetails = () => {
  return (
    <ProtectedContent hasAccess={appPermissions.ProductManager}>
      <ProductDetails />
    </ProtectedContent>
  )
}

export default ProtectedProductDetails
