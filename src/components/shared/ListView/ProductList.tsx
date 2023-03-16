import ProductCard from "@/components/products/ProductCard"
import {ChevronDownIcon, CloseIcon} from "@chakra-ui/icons"
import {
  Box,
  Button,
  Container,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack
} from "@chakra-ui/react"
import {Products} from "ordercloud-javascript-sdk"
import {FC, useCallback, useEffect, useState} from "react"
import {IProduct} from "types/ordercloud/IProduct"
import ListView from "./ListView"
const labelStyles = {
  mt: "2",
  ml: "-2.5",
  fontSize: "sm"
}
// Hook
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay] // Only re-call effect if value or delay changes
  )
  return debouncedValue
}

const ProductSearch: FC<{value: string; onSearch: any}> = ({value, onSearch}) => {
  const [searchTerm, setSearchTerm] = useState(value)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    setSearchTerm(value)
  }, [value])

  useEffect(() => {
    if (debouncedSearchTerm !== value) {
      onSearch(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm, onSearch, value])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <InputGroup maxW="300px">
      <Input
        marginBottom="0 !important"
        aria-label="Search Products"
        placeholder="Search Products..."
        value={searchTerm}
        onChange={handleInputChange}
      ></Input>
      {searchTerm && (
        <InputRightElement>
          <IconButton size="xs" aria-label="Clear search" h="1.75rem" onClick={() => setSearchTerm("")}>
            <CloseIcon />
          </IconButton>
        </InputRightElement>
      )}
    </InputGroup>
  )
}

const ProductFilters = () => {
  return (
    <Menu>
      <MenuButton as={Button} variant="outline">
        Filter <ChevronDownIcon />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => {}}>Active</MenuItem>
      </MenuList>
    </Menu>
  )
}

const ProductQueryMap = {
  s: "Search"
}

const ProductList = () => {
  return (
    <ListView<IProduct>
      service={Products.List}
      queryMap={ProductQueryMap}
      gridOptions={{templateColumns: "repeat(4, 1fr)"}}
      renderCard={(p, index, selected, onSelectChange) => (
        <ProductCard product={p} selected={selected} onProductSelected={onSelectChange} />
      )}
    >
      {({metaInformationDisplay, viewModeToggle, updateQuery, queryParams, children}) => (
        <Container maxW="container.2xl">
          <Stack direction="row" mb={5}>
            <ProductSearch value={queryParams["Search"]} onSearch={updateQuery("s")} />
            <ProductFilters />
            <Box as="span" flexGrow="1"></Box>
            {metaInformationDisplay}
            <Box as="span" width="2"></Box>
            {viewModeToggle}
            <Button colorScheme="green">Create Product</Button>
          </Stack>
          {children}
        </Container>
      )}
    </ListView>
  )
}

export default ProductList
