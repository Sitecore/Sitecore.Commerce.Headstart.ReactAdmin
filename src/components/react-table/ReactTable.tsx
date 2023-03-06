import {
  Button,
  Flex,
  Icon,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react"
import {GrFormNext, GrFormPrevious} from "react-icons/gr"
import React, {useMemo} from "react"
import {TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted} from "react-icons/ti"
import {useGlobalFilter, usePagination, useSortBy, useTable} from "react-table"

interface ReactTableProps {
  columns
  data
}
export function ReactTable(props: ReactTableProps) {
  const columns = useMemo(() => props.columns, [props.columns])
  const data = useMemo(() => props.data, [props.data])
  const tableInstance = useTable(
    // The type definition for react-table is dependent upon which options
    // are passed in, if you change the options make sure to update types/react-table.config.d.ts accordingly
    {
      columns,
      data
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    gotoPage,
    pageCount,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    setPageSize,
    setGlobalFilter,
    state
  } = tableInstance

  const buildPagesArray = (count) => {
    // count 3 returns [0, 1, 2]
    return Array(count)
      .fill(null)
      .map((value, index) => index)
  }

  const {pageIndex, pageSize} = state
  return (
    <>
      <Flex direction="column" w="100%" overflowX={{sm: "scroll", lg: "hidden"}}>
        <Flex justify="space-between" align="center" w="100%" px="22px">
          <Stack
            direction={{sm: "column", md: "row"}}
            spacing={{sm: "4px", md: "12px"}}
            align="center"
            me="12px"
            my="24px"
            minW={{sm: "100px", md: "200px"}}
          >
            <Text fontSize="sm" color="gray.500" fontWeight="normal" mb={{sm: "24px", md: "0px"}}>
              Showing {pageSize * pageIndex + 1} to{" "}
              {pageSize * (pageIndex + 1) <= data.length ? pageSize * (pageIndex + 1) : data.length} of {data.length}{" "}
              entries
            </Text>
          </Stack>
          <Input
            variant="main"
            type="text"
            placeholder="Search..."
            minW="200px"
            maxW="400px"
            fontSize="sm"
            _focus={{borderColor: "blue.500"}}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </Flex>
        <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th {...column.getHeaderProps(column.getSortByToggleProps())} pe="0px" key={index}>
                    <Flex justify="space-between" align="center" fontSize={{sm: "10px", lg: "12px"}} color="gray.400">
                      {column.render("Header")}
                      {column.canSort && (
                        <Icon
                          w={{sm: "10px", md: "14px"}}
                          h={{sm: "10px", md: "14px"}}
                          color={columns.isSorted ? "gray.500" : "gray.400"}
                          float="right"
                          as={
                            column.isSorted
                              ? column.isSortedDesc
                                ? TiArrowSortedDown
                                : TiArrowSortedUp
                              : TiArrowUnsorted
                          }
                        />
                      )}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row)
              return (
                <Tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    return (
                      <Td {...cell.getCellProps()} fontSize={{sm: "14px"}} key={index}>
                        {cell.render("Cell")}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </Tbody>
        </Table>
        {data.length > 10 && (
          <Flex direction={{sm: "column", md: "row"}} justify="space-between" align="center" px="22px" w="100%">
            <Select
              variant="main"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              color="gray.500"
              size="sm"
              borderRadius="12px"
              maxW="75px"
              cursor="pointer"
            >
              <option>5</option>
              <option>10</option>
              {data.length > 15 && <option>15</option>}
              {data.length > 20 && <option>20</option>}
              {data.length > 25 && <option>25</option>}=
            </Select>
            <Text fontSize="xs" color="gray.400" fontWeight="normal">
              entries per page
            </Text>
            <Stack direction="row" alignSelf="flex-end" spacing="4px" ms="auto">
              <Button
                variant="no-effects"
                onClick={() => previousPage()}
                transition="all .5s ease"
                w="40px"
                h="40px"
                borderRadius="8px"
                bg="#fff"
                border="1px solid lightgray"
                display={pageSize === 5 ? "none" : canPreviousPage ? "flex" : "none"}
                _hover={{
                  bg: "gray.200",
                  opacity: "0.7",
                  borderColor: "gray.500"
                }}
              >
                <Icon as={GrFormPrevious} w="16px" h="16px" color="gray.400" />
              </Button>
              {pageSize === 5 ? (
                <NumberInput
                  max={pageCount - 1}
                  min={1}
                  w="75px"
                  mx="6px"
                  defaultValue="1"
                  onChange={(e) => gotoPage(parseInt(e))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper onClick={() => nextPage()} />
                    <NumberDecrementStepper onClick={() => previousPage()} />
                  </NumberInputStepper>
                </NumberInput>
              ) : (
                buildPagesArray(pageCount).map((pageNumber, index) => {
                  return (
                    <Button
                      variant="no-effects"
                      transition="all .5s ease"
                      onClick={() => gotoPage(pageNumber - 1)}
                      w="40px"
                      h="40px"
                      borderRadius="8px"
                      bg={pageNumber === pageIndex + 1 ? "blue.500" : "#fff"}
                      border={pageNumber === pageIndex + 1 ? "none" : "1px solid lightgray"}
                      _hover={{
                        opacity: "0.7",
                        borderColor: "gray.500"
                      }}
                      key={index}
                    >
                      <Text fontSize="sm" color={pageNumber === pageIndex + 1 ? "#fff" : "gray.600"}>
                        {pageNumber}
                      </Text>
                    </Button>
                  )
                })
              )}
              <Button
                variant="no-effects"
                onClick={() => nextPage()}
                transition="all .5s ease"
                w="40px"
                h="40px"
                borderRadius="8px"
                bg="#fff"
                border="1px solid lightgray"
                display={pageSize === 5 ? "none" : canNextPage ? "flex" : "none"}
                _hover={{
                  bg: "gray.200",
                  opacity: "0.7",
                  borderColor: "gray.500"
                }}
              >
                <Icon as={GrFormNext} w="16px" h="16px" color="gray.400" />
              </Button>
            </Stack>
          </Flex>
        )}
      </Flex>
    </>
  )
}
