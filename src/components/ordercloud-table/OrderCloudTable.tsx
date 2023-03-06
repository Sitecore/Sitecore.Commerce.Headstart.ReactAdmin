import {
  Flex,
  Stack,
  Input,
  Table,
  Text,
  Thead,
  Tr,
  Th,
  Icon,
  Tbody,
  Td,
  Select,
  Skeleton,
  Box,
  Spinner
} from "@chakra-ui/react"
import {debounce, get} from "lodash"
import {ListPage} from "ordercloud-javascript-sdk"
import {useEffect, useMemo, useState} from "react"
import {TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted} from "react-icons/ti"
import {OrderCloudTableFilters, OrderCloudTableColumn, OrderCloudTableHeaders, OrderCloudTableRow} from "./models"
import {PreviousNextButton} from "./PreviousNextButton"
import {PaginationButtons} from "./PaginationButtons"
import {PaginationInput} from "./PaginationInput"

interface OrderCloudTableProps<T> {
  columns: OrderCloudTableColumn<T>[]
  data: ListPage<T>
  filters: OrderCloudTableFilters
  fetchData: (filters: OrderCloudTableFilters) => Promise<void>
}
export function OrderCloudTable<T = any>({columns, data, fetchData, filters: appliedFilters}: OrderCloudTableProps<T>) {
  if (!columns) {
    throw new Error("Required prop 'columns' is not defined for OrderCloudTable")
  }
  if (!appliedFilters) {
    throw new Error("Required prop 'filters' is not defined for OrderCloudTable")
  }
  if (!fetchData) {
    throw new Error("Required prop 'fetchData' is not defined for OrderCloudTable")
  }
  const headers = buildHeaders(columns)
  const rows = data ? buildRows(columns, data) : buildSkeletonRows(columns)
  const meta = data?.Meta || {}
  const [loading, setLoading] = useState(false)
  const [pageSize, setPageSize] = useState(meta.PageSize)
  const [page, setPage] = useState(meta.Page)
  const [filters, setFilters] = useState({
    page: meta.Page,
    pageSize: meta.PageSize,
    search: appliedFilters.search,
    sortBy: appliedFilters.sortBy
  } as OrderCloudTableFilters)

  useEffect(() => {
    setLoading(false)
  }, [data])

  const debouncedFetchData = useMemo(() => debounce(fetchData, 300), [fetchData])

  function buildHeaders(columns: OrderCloudTableColumn<T>[]): OrderCloudTableHeaders<T>[] {
    return columns.map((column) => {
      const isSorted = appliedFilters.sortBy?.length
        ? appliedFilters.sortBy.includes(column.accessor) || appliedFilters.sortBy.includes(`!${column.accessor}`)
        : false
      const isSortedDesc = appliedFilters.sortBy?.length ? appliedFilters.sortBy.includes(`!${column.accessor}`) : false
      return {
        ...column,
        isSorted,
        isSortedDesc
      }
    })
  }

  function buildRows(columns: OrderCloudTableColumn<T>[], data: ListPage<T>): OrderCloudTableRow<T>[] {
    return data.Items.map((row) => ({
      cells: columns.map((column) => {
        const value = get(row, column.accessor, null)
        return {
          value: column.Cell?.({value, row: {original: row}}) || value
        }
      })
    }))
  }

  function buildSkeletonRows(columns: OrderCloudTableColumn<T>[]): OrderCloudTableRow<T>[] {
    return Array(5)
      .fill(null)
      .map(() => ({
        cells: columns.map((column) => {
          return {
            value: <Skeleton height={10} width="100%" />
          }
        })
      }))
  }

  const handlePageChange = (page: number) => {
    setLoading(true)
    const updatedFilters = {...filters, page}
    setPage(page)
    setFilters(updatedFilters)
    fetchData(updatedFilters)
  }

  const handlePageSizeChange = (pageSize: number) => {
    setLoading(true)
    const updatedFilters = {...filters, pageSize, page: 1}
    setPage(1)
    setPageSize(pageSize)
    setFilters(updatedFilters)
    fetchData(updatedFilters)
  }

  const handleSearchChange = (search: string) => {
    setLoading(true)
    const updatedFilters = {...filters, search, page: 1}
    setPage(1)
    setFilters(updatedFilters)
    debouncedFetchData(updatedFilters)
  }

  return (
    <Flex direction="column" w="100%" overflowX={{sm: "scroll", lg: "hidden"}}>
      <Flex justify="space-between" align="center" w="100%" px="22px" marginBottom={3}>
        <Stack
          direction={{sm: "column", md: "row"}}
          spacing={{sm: "4px", md: "12px"}}
          align="center"
          me="12px"
          my="24px"
          minW={{sm: "100px", md: "200px"}}
        >
          <Text fontSize="sm" color="gray.500" fontWeight="normal" mb={{sm: "24px", md: "0px"}}>
            {data && !loading
              ? `Showing ${meta.ItemRange[0]} to ${meta.ItemRange[1]} of ${meta.TotalCount} results`
              : "Loading..."}
          </Text>
        </Stack>
        <Flex width="100%" justifyContent="end" alignItems="center">
          {loading && <Spinner display="flex" marginRight={5} />}
          <Input
            variant="main"
            type="text"
            placeholder="Search..."
            minW="200px"
            maxW="400px"
            marginBottom="0 !important"
            flexGrow={1}
            fontSize="sm"
            _focus={{borderColor: "blue.500"}}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </Flex>
      </Flex>
      <Table role="table" variant="simple" color="gray.500" mb="24px">
        <Thead>
          <Tr role="row">
            {headers.map((header, index) => (
              <Th role="columnheader" pe="0px" key={index}>
                <Flex justify="space-between" align="center" fontSize={{sm: "10px", lg: "12px"}} color="gray.400">
                  {header.Header}
                  {header.canSort && (
                    <Icon
                      w={{sm: "10px", md: "14px"}}
                      h={{sm: "10px", md: "14px"}}
                      color={header.isSorted ? "gray.500" : "gray.400"}
                      float="right"
                      as={
                        header.isSorted ? (header.isSortedDesc ? TiArrowSortedDown : TiArrowSortedUp) : TiArrowUnsorted
                      }
                    />
                  )}
                </Flex>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody role="rowgroup">
          {rows.map((row, rowIndex) => (
            <Tr key={rowIndex} role="row">
              {row.cells.map((cell, cellIndex) => (
                <Td role="cell" fontSize={{sm: "14px"}} key={cellIndex}>
                  {cell.value}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      {meta.TotalCount > 10 && (
        <Flex direction={{sm: "column", md: "row"}} justify="space-between" align="center" px="22px" w="100%">
          <Select
            variant="main"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            color="gray.500"
            size="sm"
            borderRadius="12px"
            maxW="75px"
            cursor="pointer"
          >
            <option>5</option>
            <option>10</option>
            <option>15</option>
            <option>20</option>
            <option>25</option>
          </Select>
          <Text fontSize="xs" color="gray.400" fontWeight="normal">
            entries per page
          </Text>
          <Stack direction="row" alignSelf="flex-end" spacing="4px" ms="auto">
            {page !== 1 && <PreviousNextButton type="previous" page={page} onPageChange={handlePageChange} />}
            {meta.TotalPages > 5 ? (
              <PaginationInput totalPages={meta.TotalPages} page={page} onPageChange={handlePageChange} />
            ) : (
              <PaginationButtons page={page} totalPages={meta.TotalPages} onPageChange={handlePageChange} />
            )}
            {page < meta.TotalPages && <PreviousNextButton type="next" page={page} onPageChange={handlePageChange} />}
          </Stack>
        </Flex>
      )}
    </Flex>
  )
}
