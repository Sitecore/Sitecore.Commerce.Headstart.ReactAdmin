import {
  Center,
  Checkbox,
  Flex,
  Image,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue
} from "@chakra-ui/react"
import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {FiArrowDown, FiArrowRight, FiArrowUp, FiCheckSquare} from "react-icons/fi"
import {useEffect, useState} from "react"
import BrandedSpinner from "../branding/BrandedSpinner"
import {CalculateEditorialProcess} from "./EditorialProgressBar"
import {Product} from "ordercloud-javascript-sdk"
import {textHelper} from "lib/utils/text.utils"
import {Link} from "../navigation/Link"

interface ProductListProps {
  products: Product[]
  selectedProductIds: string[]
  sortBy: string
  onSort: (columName: string) => void
  onProductSelected: (productId: string, selected: boolean) => void
  onToggleSelectAllProducts: () => void
}
const ProductList = (props: ProductListProps) => {
  const [componentProducts, setComponentProducts] = useState<Product[]>(props.products)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [sortBy, setSortBy] = useState("")
  const onSortByNameClickedInside = (columnName) => {
    setSortBy(columnName)
    props.onSort(columnName)
  }
  useEffect(() => {
    setComponentProducts(props.products)
    setSortBy(props.sortBy)
  }, [props.products, props.sortBy])

  return (
    <>
      {componentProducts ? (
        <>
          <Thead>
            <Tr>
              <Th colSpan={1}>
                <Checkbox
                  isChecked={props.products.length === props.selectedProductIds.length}
                  onChange={() => props.onToggleSelectAllProducts()}
                >
                  Select All
                </Checkbox>
              </Th>
            </Tr>
            <Tr>
              <Th cursor={"pointer"}>
                <Flex justifyContent={"flex-start"}>
                  <Text ml={2}>Product ID</Text>
                  {sortBy == "ID" ? (
                    <FiArrowUp cursor={"ID"} onClick={() => onSortByNameClickedInside("!ID")} />
                  ) : sortBy == "!ID" ? (
                    <FiArrowDown cursor={"pointer"} onClick={() => onSortByNameClickedInside("ID")} />
                  ) : (
                    <FiArrowRight cursor={"pointer"} onClick={() => onSortByNameClickedInside("ID")} />
                  )}
                </Flex>
              </Th>
              <Th>Image</Th>
              <Th>
                <Tooltip label="Sort by Name">
                  <Flex justifyContent={"flex-start"}>
                    <Text ml={2}>Product Name</Text>
                    {sortBy == "name" ? (
                      <FiArrowUp cursor={"pointer"} onClick={() => onSortByNameClickedInside("!name")} />
                    ) : sortBy == "!name" ? (
                      <FiArrowDown cursor={"pointer"} onClick={() => onSortByNameClickedInside("name")} />
                    ) : (
                      <FiArrowRight cursor={"pointer"} onClick={() => onSortByNameClickedInside("name")} />
                    )}
                  </Flex>
                </Tooltip>
              </Th>
              <Th>Description</Th>
              {/* <Th color={color}>Description</Th> */}
              <Th>
                <Tooltip label="Sort by Is Active">
                  <Flex justifyContent={"flex-start"}>
                    <Text ml={2}>Active?</Text>
                    {sortBy == "Active" ? (
                      <FiArrowUp cursor={"pointer"} onClick={() => onSortByNameClickedInside("!Active")} />
                    ) : sortBy == "!Active" ? (
                      <FiArrowDown cursor={"pointer"} onClick={() => onSortByNameClickedInside("Active")} />
                    ) : (
                      <FiArrowRight cursor={"pointer"} onClick={() => onSortByNameClickedInside("Active")} />
                    )}
                  </Flex>
                </Tooltip>
              </Th>
              <Th>
                <Flex justifyContent={"center"}>
                  <Text>Qty</Text>
                </Flex>
              </Th>
              <Th>
                <Tooltip label="Sort by Editorial Progress">
                  <Flex justifyContent={"flex-start"}>
                    <Text ml={2}>Editorial Progress</Text>
                    {sortBy == "editorialProcess" ? (
                      <FiArrowUp
                        cursor={"editorialProcess"}
                        onClick={() => onSortByNameClickedInside("!editorialProcess")}
                      />
                    ) : sortBy == "!editorialProcess" ? (
                      <FiArrowDown cursor={"pointer"} onClick={() => onSortByNameClickedInside("editorialProcess")} />
                    ) : (
                      <FiArrowRight cursor={"pointer"} onClick={() => onSortByNameClickedInside("editorialProcess")} />
                    )}
                  </Flex>
                </Tooltip>
              </Th>
            </Tr>
          </Thead>
          <Tbody alignContent={"center"}>
            {componentProducts && componentProducts.length > 0 ? (
              componentProducts.map((product, index) => (
                <Tr key={index}>
                  <Td>
                    <Checkbox
                      isChecked={props.selectedProductIds.includes(product.ID)}
                      onChange={(event) => props.onProductSelected(product.ID, event.target.checked)}
                    />
                    <Link href={"/products/" + product.ID}> {product.ID}</Link>
                  </Td>
                  <Td>
                    <Center>
                      <Link href={"/products/" + product.ID}>
                        <Image
                          src={
                            typeof product?.xp?.Images != "undefined"
                              ? product?.xp?.Images[0]?.ThumbnailUrl ?? product?.xp?.Images[0]?.Url
                              : product?.xp?.image_url ??
                                "https://mss-p-006-delivery.stylelabs.cloud/api/public/content/4fc742feffd14e7686e4820e55dbfbaa"
                          }
                          alt="product image"
                          width="50px"
                        />
                      </Link>
                    </Center>
                  </Td>
                  <Td>
                    <Link href={"/products/" + product.ID}>{product.Name}</Link>
                  </Td>
                  <Td>
                    {textHelper.stripHTML(product.Description).length > 40
                      ? textHelper.stripHTML(product.Description).substring(0, 40) + "..."
                      : textHelper.stripHTML(product.Description)}
                  </Td>
                  <Td>
                    {product.Active ? (
                      <CheckIcon boxSize={6} color={okColor} />
                    ) : (
                      <CloseIcon boxSize={6} color={errorColor} />
                    )}
                  </Td>
                  <Td textAlign={"right"}>{product?.Inventory?.QuantityAvailable}</Td>
                  <Td>{CalculateEditorialProcess(product)}%</Td>
                </Tr>
              ))
            ) : (
              <Text p={3}>No Products found</Text>
            )}
          </Tbody>
        </>
      ) : (
        <BrandedSpinner />
      )}
    </>
  )
}
export default ProductList
