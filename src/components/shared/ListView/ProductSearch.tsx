import {CloseIcon} from "@chakra-ui/icons"
import {IconButton, Input, InputGroup, InputRightElement} from "@chakra-ui/react"
import useDebounce from "hooks/useDebounce"
import {FC, useCallback, useEffect, useState} from "react"

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

export default ProductSearch
