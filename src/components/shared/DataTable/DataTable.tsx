import {
  Box,
  Center,
  Checkbox,
  Flex,
  Icon,
  ResponsiveObject,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue
} from "@chakra-ui/react"
import get from "lodash/get"
import Link from "next/link"
import {ReactElement, useMemo} from "react"
import {TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted} from "react-icons/ti"
import {IDefaultResource, ListParams, ListViewTemplate} from "../ListView/ListView"

export interface DataTableColumn<T> {
  header: string
  width?: string
  minWidth?: string
  accessor?: string
  align?: "left" | "center" | "right"
  skipHref?: boolean
  hrefResolver?: (item: T) => string
  cell?: ({row, value}: {row: {original: T}; value: any}) => ReactElement | string
  sortable?: boolean
}

export type DataTableRowActionsCallback<T> = (data: T) => ReactElement

export interface IDataTable<T> {
  columns?: DataTableColumn<T>[]
  responsive?: ResponsiveObject<DataTableColumn<T>[]>
  data: T[]
  hideColumns?: (column: DataTableColumn<T>, params: ListParams) => boolean
  params?: ListParams
  loading?: boolean
  emptyDisplay?: ListViewTemplate
  selected?: string[]
  currentSort?: string
  itemHrefResolver?: (item: T) => string
  onSelectChange?: (changedIds: string[] | string, isSelected: boolean) => void
  onSortChange: (sortKey: string, isSorted: boolean, isSortedDesc: boolean) => void
  rowActions?: (rowData: T) => ListViewTemplate
}

const DEFAULT_DATA_TABLE_EMPTY_DISPLAY: ReactElement = (
  <Center h={100}>
    <Text>No Data</Text>
  </Center>
)

const DataTable = <T extends IDefaultResource>({
  columns,
  responsive,
  hideColumns,
  data,
  params,
  loading,
  currentSort,
  emptyDisplay = DEFAULT_DATA_TABLE_EMPTY_DISPLAY,
  itemHrefResolver,
  rowActions,
  onSortChange,
  onSelectChange,
  selected
}: IDataTable<T>) => {
  const responsiveColumns = useBreakpointValue(responsive)

  //use responsive columns when available
  const currentColumns = useMemo(() => {
    const hideFilter = (column: DataTableColumn<T>) =>
      typeof hideColumns === "function" ? !hideColumns(column, params) : true
    if (responsiveColumns) return responsiveColumns.filter(hideFilter)
    return columns.filter(hideFilter)
  }, [responsiveColumns, columns, hideColumns, params])

  const headers = useMemo(() => {
    return currentColumns.map((column) => {
      const isSorted = currentSort?.length
        ? currentSort.includes(column.accessor) || currentSort.includes(`!${column.accessor}`)
        : false
      const isSortedDesc = currentSort?.length ? currentSort.includes(`!${column.accessor}`) : false
      return {
        align: "left",
        ...column,
        isSorted,
        isSortedDesc
      }
    })
  }, [currentSort, currentColumns])

  const rows = useMemo(() => {
    if (!data) return []
    return data.map((row) => ({
      data: row,
      isSelected: selected.includes(row["ID"]),
      cells: currentColumns.map((column) => {
        const value = get(row, column.accessor, null)
        const formattedValue = Array.isArray(value) ? value.join(", ") : value
        return {
          skipHref: column.skipHref,
          hrefResolver: column.hrefResolver,
          minWidth: column.minWidth,
          width: column.width,
          align: column.align,
          value: column.cell?.({value, row: {original: row}}) || formattedValue
        }
      })
    }))
  }, [data, currentColumns, selected])

  const indeterminateSelectAll = useMemo(() => {
    if (!data) return false
    return selected.length && selected.length < data.length
  }, [selected, data])

  const columnCount = useMemo(() => {
    let result = currentColumns.length
    if (rowActions) result++
    if (onSelectChange) result++
    return result
  }, [rowActions, onSelectChange, currentColumns])

  const handleSelectAllChange = (isChecked) => {
    onSelectChange(
      data.map((r) => r.ID),
      isChecked
    )
  }

  return (
    <TableContainer
      whiteSpace="normal"
      border=".5px solid"
      borderColor="chakra-border-color"
      shadow="lg"
      overflowX="hidden"
      w="100%"
      minH={400}
      rounded="md"
    >
      {loading && (
        <Box position="absolute" zIndex={2} left={0} right={0} top={0} bottom={0} pointerEvents="none">
          <Center h="100%" color="teal">
            <Spinner size="xl" />
          </Center>
        </Box>
      )}
      <Table role="table" w="100%" variant="striped" bg={"st.tableStripeBackground"}>
        <Thead>
          <Tr role="row">
            {onSelectChange && (
              <Th color="inherit" w="1%">
                <Checkbox
                  borderColor={"gray.400"}
                  isIndeterminate={indeterminateSelectAll}
                  isChecked={data && data.length <= selected.length}
                  onChange={(e) => handleSelectAllChange(e.target.checked)}
                />
              </Th>
            )}
            {headers.map((header, index) => (
              <Th
                w={header.width}
                minW={header.minWidth}
                role="columnheader"
                pe={header.sortable && header.align === "left" ? "0px" : 6}
                key={index}
                style={{cursor: header.sortable ? "pointer" : "auto"}}
                onClick={
                  header.sortable
                    ? () => {
                        onSortChange(header.accessor, header.isSorted, header.isSortedDesc)
                      }
                    : undefined
                }
              >
                <Flex
                  justify={header.align === "right" ? "end" : header.align === "center" ? "center" : "space-between"}
                  alignContent="end"
                  align="center"
                >
                  {header.header}
                  {header.sortable && (
                    <Icon
                      w={{sm: "10px", md: "14px"}}
                      h={{sm: "10px", md: "14px"}}
                      as={
                        header.isSorted ? (header.isSortedDesc ? TiArrowSortedDown : TiArrowSortedUp) : TiArrowUnsorted
                      }
                    />
                  )}
                </Flex>
              </Th>
            ))}
            {rowActions && <Th w="1%" />}
          </Tr>
        </Thead>

        <Tbody role="rowgroup" position="relative" minH={100}>
          {rows.map((row, rowIndex) => (
            <Tr key={rowIndex} role="row" cursor="pointer">
              {onSelectChange && (
                <Td w="1%">
                  <Checkbox
                    borderColor="gray.400"
                    isChecked={selected.includes(row.data["ID"])}
                    onChange={(e) => onSelectChange(row.data["ID"], e.target.checked)}
                  />
                </Td>
              )}
              {row.cells.map((cell, cellIndex) => {
                const defaultCellReturn = (
                  <Td textAlign={cell.align} w={cell.width} minW={cell.minWidth} role="cell" key={cellIndex}>
                    {cell.value}
                  </Td>
                )
                if (cell.skipHref || !(cell.hrefResolver || itemHrefResolver)) {
                  return defaultCellReturn
                }
                try {
                  const hrefValue = cell.hrefResolver ? cell.hrefResolver(row.data) : itemHrefResolver(row.data)
                  return (
                    <Td
                      h="1px"
                      padding={0}
                      textAlign={cell.align}
                      w={cell.width}
                      minW={cell.minWidth}
                      role="cell"
                      key={cellIndex}
                    >
                      <Link passHref href={hrefValue}>
                        <Box paddingY={4} paddingX={6} display="flex" alignItems="center" h="100%" as="a">
                          {cell.value}
                        </Box>
                      </Link>
                    </Td>
                  )
                } catch (e) {
                  console.error("DataTable: itemHrefResolver error: ", e)
                  return defaultCellReturn
                }
              })}
              {rowActions && <Td w="1%">{rowActions(row.data)}</Td>}
            </Tr>
          ))}
          {!loading && !rows.length && (
            <Tr>
              <Td align="center" colSpan={columnCount}>
                {emptyDisplay}
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default DataTable
