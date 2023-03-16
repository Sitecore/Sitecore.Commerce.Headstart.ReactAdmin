import {
  Checkbox,
  Flex,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from "@chakra-ui/react"
import {FC, ReactElement, useCallback, useMemo} from "react"
import get from "lodash/get"
import {TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted} from "react-icons/ti"

export interface DataTableColumn<T> {
  header: string
  accessor?: string
  align?: "left" | "center" | "right"
  cell?: ({row, value}: {row: {original: T}; value: any}) => ReactElement | string
  sortable?: boolean
}

export type DataTableRowActionsCallback<T> = (data: T) => ReactElement

export interface DataTableProps<T> {
  data: T[]
  selected?: string[]
  onSelectAll?: () => void
  onSelectChange?: (id: string, isSelected: boolean) => void
  columns: DataTableColumn<T>[]
  currentSort?: string
  rowActions?: (rowData: T) => ReactElement
}

const DataTable = <T,>({
  columns,
  data,
  currentSort,
  rowActions,
  onSelectAll,
  onSelectChange,
  selected
}: DataTableProps<T>) => {
  const headers = useMemo(() => {
    return columns.map((column) => {
      const isSorted = currentSort?.length
        ? currentSort.includes(column.accessor) || currentSort.includes(`!${column.accessor}`)
        : false
      const isSortedDesc = currentSort?.length ? currentSort.includes(`!${column.accessor}`) : false
      return {
        ...column,
        isSorted,
        isSortedDesc
      }
    })
  }, [currentSort, columns])

  const rows = useMemo(() => {
    return data.map((row) => ({
      data: row,
      isSelected: selected.includes(row["ID"]),
      cells: columns.map((column) => {
        const value = get(row, column.accessor, null)
        return {
          align: column.align,
          value: column.cell?.({value, row: {original: row}}) || value
        }
      })
    }))
  }, [data, columns, selected])

  const tableHeaderBg = useColorModeValue("white.000", "gray.900")
  const tableBg = useColorModeValue("brand.300", "brand.500")
  const tableColor = useColorModeValue("textColor.900", "textColor.100")
  const tableBorder = useColorModeValue("gray.400", "gray.400")

  const indeterminateSelectAll = useMemo(() => {
    return selected.length && selected.length !== data.length
  }, [selected, data])

  return (
    <TableContainer width={"full"} rounded={8} bg={tableHeaderBg} color={tableColor}>
      <Table role="table" variant="simple">
        <Thead>
          <Tr role="row">
            {onSelectChange && (
              <Th colSpan={1} width="1%">
                <Checkbox
                  isIndeterminate={indeterminateSelectAll}
                  colorScheme={indeterminateSelectAll ? "gray" : "blue"}
                  isChecked={data.length === selected.length}
                  onChange={onSelectAll}
                />
              </Th>
            )}
            {headers.map((header, index) => (
              <Th textAlign={header.align} role="columnheader" pe="0px" key={index}>
                <Flex justify="space-between" align="center" fontSize={{sm: "10px", lg: "12px"}} color="gray.400">
                  {header.header}
                  {header.sortable && (
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
            {rowActions && <Th />}
          </Tr>
        </Thead>
        <Tbody role="rowgroup">
          {rows.map((row, rowIndex) => (
            <Tr key={rowIndex} role="row">
              {onSelectChange && (
                <Td colSpan={1}>
                  <Checkbox
                    isChecked={selected.includes(row.data["ID"])}
                    onChange={(e) => onSelectChange(row.data["ID"], e.target.checked)}
                  />
                </Td>
              )}
              {row.cells.map((cell, cellIndex) => (
                <Td textAlign={cell.align} role="cell" key={cellIndex}>
                  {cell.value}
                </Td>
              ))}
              {rowActions && <Td>{rowActions(row.data)}</Td>}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default DataTable
