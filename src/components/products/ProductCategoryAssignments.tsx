import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  FormControl,
  Heading,
  HStack,
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
import {
  Catalog,
  Categories,
  Category,
  CategoryProductAssignment,
  Product,
  Products,
  RequiredDeep
} from "ordercloud-javascript-sdk"
import React from "react"
import {useEffect, useState} from "react"
import {FiPlus, FiTrash2} from "react-icons/fi"
import {ICatalog} from "types/ordercloud/ICatalog"
import {ICategory} from "types/ordercloud/ICategoryXp"
import {IProduct} from "types/ordercloud/IProduct"
import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"

type ProductDataProps = {
  product: RequiredDeep<Product<any>>
  catalog: Catalog
}

export default function ProductCategoryAssignments({product, catalog}: ProductDataProps) {
  const [productCategoryAssignments, setProductCategoryAssignments] = useState<Category[]>(null)
  const [componentProduct, setComponentProduct] = useState<RequiredDeep<Product<any>>>(product)
  const [isLoading, setIsLoading] = useState(false)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = React.useRef()
  const [isLinking, setIsLinking] = useState(false)
  const [availableCategories, setAvailableCategories] = useState<Category<any>[]>(null)
  const [isCategoryChosen, setIsCategoryChosen] = useState(false)
  const [newCategory, setNewCategory] = useState("")

  const color = useColorModeValue("textColor.900", "textColor.100")
  const bg = useColorModeValue("brand.500", "brand.500")

  useEffect(() => {
    async function GetAssignments() {
      let categories: Category[] = []
      if (catalog) {
        setIsLoading(true)
        const categoryAssignments = await Categories.ListProductAssignments(catalog?.ID, {
          productID: componentProduct.ID
        })

        await Promise.all(
          categoryAssignments.Items.map(async (item) => {
            const category = await Categories.Get<ICategory>(catalog?.ID, item.CategoryID)
            categories.push(category)
          })
        )
        setIsLoading(false)
      }

      setProductCategoryAssignments(categories)
    }
    GetAssignments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog])

  const onRemoveCategory = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const categoryId = e.currentTarget.dataset.id
    await Categories.DeleteProductAssignment(catalog.ID, categoryId, componentProduct.ID)
    var product = await Products.Get<IProduct>(componentProduct.ID)
    setComponentProduct(product)
    setNewCategory("")
    setIsLoading(false)
  }

  const onCategoryLink = async (e) => {
    setIsLinking(true)
    e.preventDefault()
    const categoryAssignment: CategoryProductAssignment = {
      CategoryID: newCategory,
      ProductID: product.ID
    }

    await Categories.SaveProductAssignment(catalog.ID, categoryAssignment)

    var product = await Products.Get<IProduct>(componentProduct.ID)
    setComponentProduct(product)
    setIsLinking(false)
    setNewCategory("")
    setAvailableCategories(null)
    onClose()
  }

  const onAvailableCategoryClick = (e) => {
    e.preventDefault()
    const chosenCategory = e.currentTarget.dataset.id
    setNewCategory(chosenCategory)
    setIsCategoryChosen(true)
  }

  const onCategoryLinkInputChanged = (e) => {
    e.preventDefault()
    setIsCategoryChosen(false)
    setNewCategory(e.target.value)
    Categories.List<ICatalog>(catalog.ID, {
      searchOn: ["Name", "ID"],
      search: e.target.value
    }).then((innerAvailableCategories) => {
      const categoryIds = productCategoryAssignments.map((item) => {
        return item.ID
      })
      const filteredCatalogs = innerAvailableCategories.Items.filter(
        (innerCategory) => !categoryIds.includes(innerCategory.ID)
      )
      setAvailableCategories(filteredCatalogs)
    })
  }

  return (
    <>
      <BrandedBox>
        <>
          <HStack float={"right"}>
            <Tooltip label="Add to Category">
              <Button colorScheme="brandButtons" onClick={onOpen} aria-label="add to category">
                <FiPlus />
              </Button>
            </Tooltip>
          </HStack>
          <Heading size={"md"}>
            Category Assigments of <i>{catalog?.Name}</i>
          </Heading>
          {isLoading ? (
            <Box pt={6} textAlign={"center"}>
              Updating... <BrandedSpinner />
            </Box>
          ) : (
            <Box width="full" pb={2} pt={4}>
              {/* <Text opacity={0.5} fontWeight={"bold"}>
            Assignments
          </Text> */}
              <BrandedTable>
                <Thead>
                  <Tr>
                    <Th color={color}>ID</Th>
                    <Th color={color}>Name</Th>
                    <Th color={color}>Action</Th>
                  </Tr>
                </Thead>
                <Tbody alignContent={"center"}>
                  {productCategoryAssignments?.length > 0 ? (
                    <>
                      {productCategoryAssignments.map((item, index) => {
                        return (
                          <Tr key={index}>
                            <Td>{item.ID}</Td>
                            <Td>{item.Name}</Td>
                            <Td>
                              {" "}
                              <Tooltip label="Remove from Category">
                                <Button
                                  colorScheme="brandButtons"
                                  aria-label="remove from category"
                                  onClick={onRemoveCategory}
                                  data-id={item.ID}
                                >
                                  <FiTrash2 />
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
            </Box>
          )}
        </>
      </BrandedBox>
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
                  Link a Category to Product
                </AlertDialogHeader>

                <AlertDialogBody>Please choose Category to link</AlertDialogBody>
                <FormControl ml={6}>
                  <Input
                    autoComplete="off"
                    justifyContent={"center"}
                    width={"90%"}
                    aria-label="Category ID"
                    value={newCategory}
                    onChange={onCategoryLinkInputChanged}
                    onFocus={onCategoryLinkInputChanged}
                    placeholder={"Enter and search for Catalogs..."}
                  />
                </FormControl>
                {(availableCategories?.length ?? 0) > 0 ? (
                  <>
                    <Box pt={4} pl={4} pb={4} m={6} border={"1px solid white"}>
                      <Heading as="h3" size="md" pb={3}>
                        Available Categories (Please choose...)
                      </Heading>
                      <UnorderedList>
                        {availableCategories.map((element, key) => (
                          <Tooltip key={key} label={"Click to choose"}>
                            <ListItem
                              textDecor={"none"}
                              _hover={{textDecor: "underline"}}
                              cursor={"copy"}
                              onClick={onAvailableCategoryClick}
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
                    {isCategoryChosen ? null : (
                      <Text pb={2}>Please choose from the search results to link a Category</Text>
                    )}
                    <Button width={"45%"} size={"md"} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      float={"right"}
                      width={"45%"}
                      size={"md"}
                      colorScheme="brandButtons"
                      onClick={onCategoryLink}
                      ml={3}
                      disabled={!isCategoryChosen}
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
