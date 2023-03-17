import {Box, Center, Grid, GridItem, Heading, Spinner, VStack} from "@chakra-ui/react"
import {ReactElement} from "react"
import {IDefaultResource} from "../ListView/ListView"

export interface IDataGrid<T extends IDefaultResource> {
  data: T[]
  loading?: boolean
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
  loading,
  columns = DEFAULT_GRID_COLUMNS,
  gap = DEFAULT_GRID_GAP,
  gridItemActions,
  renderGridItem = DEFAULT_RENDER_GRID_ITEM,
  selected,
  onSelectChange
}: IDataGrid<T>) => {
  return (
    <Grid
      position="relative"
      as="section"
      gap={gap}
      templateColumns={`repeat(${columns}, 1fr)`}
      w="full"
      width="100%"
      minH={30}
    >
      {loading && (
        <Box
          zIndex={2}
          position="absolute"
          left={0}
          right={0}
          top={0}
          bottom={0}
          pointerEvents="none"
          bgColor="whiteAlpha.700"
        >
          <Center h="100%">
            <Spinner size="xl" />
          </Center>
        </Box>
      )}
      {data &&
        data.map((o, i) => (
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
