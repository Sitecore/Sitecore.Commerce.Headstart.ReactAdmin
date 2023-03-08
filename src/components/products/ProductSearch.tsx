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
  CheckboxGroup,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spacer,
  Spinner,
  Stack,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react"
import {ChangeEvent, useEffect, useRef, useState} from "react"
import {FiChevronDown, FiChevronUp} from "react-icons/fi"
import {HiOutlineViewGrid, HiOutlineViewList} from "react-icons/hi"
import {Product, Products, Promotions} from "ordercloud-javascript-sdk"

import {AiOutlineSearch} from "react-icons/ai"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"
import {CalculateEditorialProcess} from "./EditorialProgressBar"
import Card from "../card/Card"
import {ChevronDownIcon} from "@chakra-ui/icons"
import ExportToCsv from "components/demo/ExportToCsv"
import {IProduct} from "types/ordercloud/IProduct"
import {IPromotion} from "types/ordercloud/IPromotion"
import {Link} from "../navigation/Link"
import {NextSeo} from "next-seo"
import ProductGrid from "./ProductGrid"
import ProductList from "./ProductList"
import {ProductListOptions} from "../../services/ordercloud.service"
import {useErrorToast} from "hooks/useToast"

interface ProductSearchProps {
  query: string
}

export default function ProductSearch({query}: ProductSearchProps) {
  const [selectedPromotion, setselectedPromotion] = useState("")
  const [promotions, setPromotions] = useState([])
  const optionsSearchType = "ExactPhrasePrefix"
  const [optionsSearch, setOptionsSearch] = useState("")
  const [optionsSortBy, setOptionsSortBy] = useState("name")
  const errorToast = useErrorToast()
  const [products, setProducts] = useState<IProduct[]>(null)
  const [componentProducts, setComponentProducts] = useState<IProduct[]>(null)
  const [isLoading, setIsLoading] = useState(true)
  const sliderColor = useColorModeValue("brand.400", "brand.600")
  const [editorialProgressFilter, setEditorialProgressFilter] = useState(100)
  const [sortBy, setSortBy] = useState("name")
  const [sortingChanging, setSortingChanging] = useState(false)
  const [sortDesc, setSortDesc] = useState(false)
  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm"
  }
  const [toggleViewMode, setToggleViewMode] = useState(false)

  const [isBulkImportDialogOpen, setBulkImportDialogOpen] = useState(false)
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const [isPromotionDialogOpen, setPromotionDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const cancelRef = useRef()

  const requestExportCSV = () => {}
  const requestImportCSV = () => {}

  useEffect(() => {
    async function GetProducts() {
      const options: ProductListOptions = {}
      options.search = optionsSearch
      options.searchOn = ["Name", "Description", "ID"]
      options.searchType = optionsSearchType
      options.sortBy = [optionsSortBy]
      options.pageSize = 100
      var productList = await Products.List<IProduct>(options)
      let productItems = productList.Items
      setComponentProducts(productItems)
      setProducts(productItems)
      setIsLoading(false)
      const promotionsList = await Promotions.List<IPromotion>()
      let promotionItems = promotionsList.Items
      setPromotions(promotionItems)
    }

    GetProducts()
  }, [optionsSearch, optionsSearchType, optionsSortBy])

  const [searchQuery, setSearchQuery] = useState(query)
  const {isOpen: isOpenAddProduct, onOpen: onOpenAddProduct, onClose: onCloseAddProduct} = useDisclosure()
  const {
    isOpen: isOpenMassEditProducts,
    onOpen: onOpenselectedProductIds,
    onClose: onCloseMassEditProducts
  } = useDisclosure()
  const [isAdding, setIsAdding] = useState(false)
  const [isMassEditing, setIsMassEditing] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [formValues, setFormValues] = useState({
    id: "",
    name: "",
    description: "",
    isActive: false,
    isInactive: false
  })

  const onSearchClicked = async () => {
    setOptionsSortBy("name")
    setSortBy("name")
    setEditorialProgressFilter(100)
    setOptionsSearch(searchQuery)
  }

  // TODO Add more properties in Add handling
  const onProductAdd = async (e) => {
    if (formValues.id == "" || formValues.name == "") {
      errorToast({
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
    }, 5000)
  }

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

  const handleToggleSelectAllProducts = () => {
    if (products.length === selectedProductIds.length) {
      setSelectedProductIds([])
    } else {
      setSelectedProductIds(products.map((p) => p.ID))
    }
  }

  const onResetSearch = (e) => {
    //console.log("onResetSearch")
    setSearchQuery("")
    setOptionsSortBy("name")
    setSortBy("name")
    setSelectedProductIds([])
    //setReload(true)
    setEditorialProgressFilter(100)
    setSortDesc(false)
  }

  const onExecuteMassEdit = async () => {
    setIsMassEditing(true)
    var activate = formValues.isActive
    var deactivate = formValues.isInactive
    var newActivationStatus = activate ? true : deactivate ? false : null
    if (newActivationStatus == null) {
      errorToast({
        title: "No Activation Status set",
        description: "Please choose at least 1 activation status"
      })
      setIsMassEditing(false)
      return
    }

    const requests = selectedProductIds.map((productId) =>
      Products.Patch<IProduct>(productId, {Active: newActivationStatus})
    )
    const responses = await Promise.all(requests)

    const updatedProducts = products.map((p) => {
      const responseProduct = responses.find((r) => r.ID === p.ID)
      if (responseProduct) {
        p.Active = responseProduct.Active
      }
      return p
    })
    setProducts(updatedProducts)

    const updatedComponentProducts = componentProducts.map((p) => {
      const responseProduct = responses.find((r) => r.ID === p.ID)
      if (responseProduct) {
        p.Active = responseProduct.Active
      }
      return p
    })
    setComponentProducts(updatedComponentProducts)

    setOptionsSearch(searchQuery)
    setIsMassEditing(false)
    setSelectedProductIds([])
    onCloseMassEditProducts()
    setFormValues((v) => ({
      ...v,
      ["isActive"]: false,
      ["isInactive"]: false,
      ["name"]: "",
      ["id"]: "",
      ["description"]: ""
    }))
    setEditorialProgressFilter(100)
  }

  const handleProductSelected = (productId: string, selected: boolean) => {
    if (selected) {
      const newselectedProductIds = [...selectedProductIds, productId]
      setSelectedProductIds(newselectedProductIds)
    } else {
      const newselectedProductIds = selectedProductIds.filter((pID) => pID !== productId)
      setSelectedProductIds(newselectedProductIds)
    }
  }

  const onMassEditOpenClicked = async (e) => {
    if (selectedProductIds.length == 0) {
      errorToast({
        title: "No Products selected",
        description: "Please select at least 1 Product for mass editing"
      })
    } else {
      onOpenselectedProductIds()
    }
  }

  const onSortByNameClicked = (newVal: string) => {
    setSortingChanging(true)
    if (newVal == "editorialProcess") {
      var tmpComponentProducts = [...componentProducts]
      var newProducts = tmpComponentProducts.sort((a, b) => CalculateEditorialProcess(a) - CalculateEditorialProcess(b))
      setComponentProducts(newProducts)
    } else if (newVal == "!editorialProcess") {
      var tmpComponentProducts = [...componentProducts]
      var newProducts = tmpComponentProducts.sort((a, b) => CalculateEditorialProcess(b) - CalculateEditorialProcess(a))
      setComponentProducts(newProducts)
    } else {
      setOptionsSearch(searchQuery)
      if (newVal != "") {
        setOptionsSortBy(newVal)
      }
    }
    setSortBy(newVal)
    setSortDesc(newVal.substring(0, 1) == "!")
    setSortingChanging(false)
  }

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onSortByNameClicked(e.target.value)
  }

  const onEditorialProgressFilterChanged = async (e) => {
    var newProducts = products.filter((element) => {
      return CalculateEditorialProcess(element) <= e
    })

    if (optionsSortBy == "editorialProcess") {
      var tmpComponentProducts = [...newProducts]
      newProducts = tmpComponentProducts.sort((a, b) => CalculateEditorialProcess(a) - CalculateEditorialProcess(b))
    } else if (optionsSortBy == "!editorialProcess") {
      var tmpComponentProducts = [...newProducts]
      newProducts = tmpComponentProducts.sort((a, b) => CalculateEditorialProcess(b) - CalculateEditorialProcess(a))
    }

    setComponentProducts(newProducts)
  }

  return (
    <>
      {componentProducts ? (
        <VStack p={0} spacing={6} width="full" align="center">
          <NextSeo title="Products List" />

          {isLoading && !sortingChanging ? (
            <BrandedSpinner />
          ) : (
            <>
              <HStack justifyContent="space-between" w="100%">
                <Link href="" onClick={onOpenAddProduct}>
                  <Button variant="primaryButton">Create Product</Button>
                </Link>
                <HStack>
                  <Button
                    variant="link"
                    color="gray.500"
                    fontWeight="400"
                    fontSize="10px"
                    marginRight="30px"
                    onClick={onResetSearch}
                  >
                    Reset Search
                  </Button>
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
                      Filters <ChevronDownIcon />
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <VStack>
                          <HStack width={"full"} justifyContent={"space-between"}>
                            <Box width={"100%"} pt={8} pb={4} pl={6} pr={6}>
                              <Slider
                                borderRight={"solid black"}
                                borderLeft={"solid black"}
                                aria-label="Editorial Progress Filter"
                                defaultValue={100}
                                value={editorialProgressFilter}
                                onChange={(val) => setEditorialProgressFilter(val)}
                                onChangeEnd={onEditorialProgressFilterChanged}
                                min={0}
                                max={100}
                                step={1}
                              >
                                <SliderMark value={0} {...labelStyles}>
                                  0%
                                </SliderMark>
                                <SliderMark value={25} {...labelStyles}>
                                  25%
                                </SliderMark>
                                <SliderMark value={50} {...labelStyles}>
                                  50%
                                </SliderMark>
                                <SliderMark value={75} {...labelStyles}>
                                  75%
                                </SliderMark>
                                <SliderMark value={100} {...labelStyles}>
                                  100%
                                </SliderMark>
                                <SliderMark
                                  value={editorialProgressFilter}
                                  textAlign="center"
                                  bg={sliderColor}
                                  color="white"
                                  mt="-10"
                                  ml="-5"
                                  w="12"
                                >
                                  {editorialProgressFilter}%
                                </SliderMark>
                                <SliderTrack bg={"lightgray"}>
                                  <SliderFilledTrack bg={sliderColor} />
                                </SliderTrack>
                                <SliderThumb />
                              </Slider>
                              <Text fontWeight={"bold"} pt={5} ml={-2}>
                                Filter by Editorial Progress...
                              </Text>
                            </Box>
                          </HStack>
                          <Text>Product Status</Text>
                          <CheckboxGroup>
                            <Stack spacing={[1, 3]} direction={["column", "row"]}>
                              <Checkbox value="Completed" defaultChecked>
                                Completed
                              </Checkbox>
                              <Checkbox value="AwaitingApproval" defaultChecked>
                                Awaiting Approval
                              </Checkbox>
                              <Checkbox value="Canceled" defaultChecked>
                                Canceled
                              </Checkbox>
                              <Checkbox value="Declined" defaultChecked>
                                Declined
                              </Checkbox>
                              <Checkbox value="Open" defaultChecked>
                                Open
                              </Checkbox>
                            </Stack>
                          </CheckboxGroup>
                          <Divider />
                          <HStack>
                            <Select
                              onChange={handleSelectChange}
                              w={"60%"}
                              value={sortBy.substring(0, 1) == "!" ? sortBy.substring(1) : sortBy}
                            >
                              <option value="name">Name</option>
                              <option value="ID">Product ID</option>
                              <option value="editorialProcess">Progress</option>
                              <option value="Active">Active</option>
                            </Select>
                            <Tooltip label="Sort Asc/Desc">
                              <IconButton
                                aria-label="Sort Asc/Desc"
                                icon={sortDesc ? <FiChevronDown /> : <FiChevronUp />}
                                onClick={() => {
                                  setSortDesc(!sortDesc)
                                  sortBy.substring(0, 1) == "!"
                                    ? setSortBy(sortBy.substring(1))
                                    : setSortBy("!" + sortBy)
                                  optionsSortBy.substring(0, 1) == "!"
                                    ? setOptionsSortBy(optionsSortBy.substring(1))
                                    : setOptionsSortBy("!" + optionsSortBy)
                                }}
                                float="right"
                              />
                            </Tooltip>
                          </HStack>
                        </VStack>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  <Button variant="secondaryButton" onClick={onMassEditOpenClicked}>
                    Bulk Edit
                  </Button>
                  <Button variant="secondaryButton" onClick={() => setPromotionDialogOpen(true)}>
                    Assign Promotion
                  </Button>
                  <Button variant="secondaryButton" onClick={() => setBulkImportDialogOpen(true)}>
                    Bulk Import
                  </Button>
                  <ExportToCsv />
                </HStack>
              </HStack>
              <Card showclosebutton="false">
                <HStack justifyContent="space-between">
                  <Text fontWeight={"bold"} marginLeft={8}>
                    Total Products: {componentProducts.length}
                  </Text>
                  <Box>
                    <HStack>
                      <Box pb="15px">
                        <Icon
                          aria-label="Grid View"
                          as={HiOutlineViewGrid}
                          onClick={() => setToggleViewMode(false)}
                          fontSize="36px"
                          color="gray.200"
                          cursor="pointer"
                        />
                      </Box>
                      <Box pb="15px">
                        <Icon
                          aria-label="List View"
                          as={HiOutlineViewList}
                          onClick={() => setToggleViewMode(true)}
                          fontSize="36px"
                          color="gray.200"
                          cursor="pointer"
                        />
                      </Box>
                      <Spacer width="20px"></Spacer>
                      <InputGroup width={"450px"} float="right">
                        <InputLeftElement>
                          <AiOutlineSearch />
                        </InputLeftElement>
                        <Input
                          autoComplete="off"
                          placeholder="Enter here ..."
                          aria-label="Enter Search Term"
                          //_placeholder={{color: color}}

                          id={"headerSearchInput"}
                          width={"100%"}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              onSearchClicked()
                            }
                          }}
                        />
                      </InputGroup>
                    </HStack>
                  </Box>
                </HStack>
                <BrandedTable>
                  {toggleViewMode ? (
                    <ProductList
                      products={componentProducts}
                      selectedProductIds={selectedProductIds}
                      onToggleSelectAllProducts={handleToggleSelectAllProducts}
                      onProductSelected={handleProductSelected}
                      onSort={(columnName) => onSortByNameClicked(columnName)}
                      sortBy={sortBy}
                    />
                  ) : (
                    <ProductGrid
                      products={componentProducts}
                      selectedProductIds={selectedProductIds}
                      onToggleSelectAllProducts={handleToggleSelectAllProducts}
                      onProductSelected={handleProductSelected}
                    />
                  )}
                </BrandedTable>
                <Box>
                  <Text fontWeight={"bold"} p={3} float={"left"}>
                    {componentProducts.length} out of {componentProducts.length}
                    Products
                  </Text>
                </Box>
              </Card>
            </>
          )}
        </VStack>
      ) : (
        <BrandedSpinner />
      )}

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

      <Modal isOpen={isOpenMassEditProducts} onClose={onCloseMassEditProducts}>
        <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent>
          {isMassEditing ? (
            <ModalHeader textAlign={"center"}>
              MassEditing... <BrandedSpinner />
            </ModalHeader>
          ) : (
            <>
              <ModalHeader>Mass Edit Products</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Text>You have selected {selectedProductIds.length} Products</Text>
                <FormControl mt={4}>
                  <FormLabel>Activate</FormLabel>
                  <Checkbox isChecked={formValues.isActive} onChange={handleCheckboxChange("isActive")} />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Deactivate</FormLabel>
                  <Checkbox isChecked={formValues.isInactive} onChange={handleCheckboxChange("isInactive")} />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <HStack justifyContent="space-between" w="100%">
                  <Button onClick={onCloseMassEditProducts} variant="secondaryButton">
                    Cancel
                  </Button>
                  <Button colorScheme="purple" mr={3} onClick={onExecuteMassEdit} variant="primaryButton">
                    Save
                  </Button>
                </HStack>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isBulkImportDialogOpen}
        onClose={() => setBulkImportDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Bulk Import Products
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Bulk import products from an excel or csv file, once the upload button is clicked behind the scenes a
                job will be kicked off load each of the products included in your files, once it has completed you will
                see them appear in your search.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setBulkImportDialogOpen(false)}
                  disabled={loading}
                  variant="secondaryButton"
                >
                  Cancel
                </Button>
                <Button onClick={requestImportCSV} disabled={loading}>
                  {loading ? <Spinner color="brand.500" /> : "Import Products"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isPromotionDialogOpen}
        onClose={() => setPromotionDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Attach a Promotion
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Select a promotion from the dropdown to assign to the previously selected products.
                <Select title="Select promotion" mt="20px" value={selectedPromotion}>
                  {!!promotions.length &&
                    promotions.map((promotion) => (
                      <option key={promotion.ID} value={promotion.ID}>
                        {promotion.Name}
                      </option>
                    ))}
                </Select>
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setPromotionDialogOpen(false)}
                  disabled={loading}
                  variant="secondaryButton"
                >
                  Cancel
                </Button>
                <Button onClick={requestImportCSV} disabled={loading}>
                  {loading ? <Spinner color="brand.500" /> : "Assign Promotion"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
