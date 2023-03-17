import {Grid, GridItem, Heading, VStack} from "@chakra-ui/react"
import {ReactElement} from "react"
import {IDefaultResource} from "../ListView/ListView"

export interface IDataGrid<T extends IDefaultResource> {
  data: T[]
  columns?: number
  gap?: number
  selected?: string[]
  onSelectChange?: (id: string, isSelected: boolean) => void
  gridItemActions?: (itemData: T) => ReactElement
  renderGridItem?: (
    item: T,
    index: number,
    gridItemActions?: (itemData: T) => ReactElement,
    isSelected?: boolean,
    onSelectChange?: (id: string, isSelected: boolean) => void
  ) => ReactElement
}
const DEFAULT_GRID_COLUMNS = 4
const DEFAULT_GRID_GAP = 2
const DEFAULT_RENDER_GRID_ITEM = (o: IDefaultResource, i: number) => (
  <VStack
    h="full"
    justifyContent="space-between"
    p={2}
    backgroundColor="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
    shadow="xl"
  >
    <Heading as="h3" fontSize="lg">
      {o.Name.length > 39 ? o.Name.substring(0, 39) + "..." : o.Name}
    </Heading>
  </VStack>
)

const DataGrid = <T extends IDefaultResource>({
  data,
  columns = DEFAULT_GRID_COLUMNS,
  gap = DEFAULT_GRID_GAP,
  gridItemActions,
  renderGridItem = DEFAULT_RENDER_GRID_ITEM,
  selected,
  onSelectChange
}: IDataGrid<T>) => {
  return (
    <Grid as="section" gap={gap} templateColumns={`repeat(${columns}, 1fr)`} w="full" width="100%">
      {data.map((o, i) => (
        <GridItem
          colSpan={1}
          rowSpan={1}
          bg="gridCellBg"
          w="full"
          width="100%"
          rounded="lg"
          overflow="h"
          key={i}
          borderStyle="none"
        >
          {renderGridItem(o, i, gridItemActions, selected.includes(o.ID), onSelectChange)}
        </GridItem>
      ))}
    </Grid>
  )
}

export default DataGrid
