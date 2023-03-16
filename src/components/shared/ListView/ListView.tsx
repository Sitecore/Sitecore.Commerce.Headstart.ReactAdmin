import {Box, ButtonGroup, Grid, GridItem, Heading, IconButton, Text, VStack} from "@chakra-ui/react"
import {useRouter} from "next/router"
import {ListPage, ListPageWithFacets, Product} from "ordercloud-javascript-sdk"
import {ReactElement, useCallback, useEffect, useMemo, useState} from "react"
import {HiOutlineViewGrid, HiOutlineViewList} from "react-icons/hi"
import DataTable, {DataTableColumn, DataTableRowActionsCallback} from "../DataTable/DataTable"

interface ListViewTableOptions<T> {
  columns: DataTableColumn<T>[]
  rowActions?: DataTableRowActionsCallback<T>
}

interface ListViewGridOptions {
  templateColumns?: string
  templateRows?: string
  gap?: number
}

interface ListViewProps<T = {ID: string; Name: string}, F = any> {
  service?: (...args) => Promise<T extends Product ? ListPageWithFacets<T, F> : ListPage<T>>
  tableOptions: ListViewTableOptions<T>
  gridOptions?: ListViewGridOptions
  renderCard?: (
    item: T,
    index: number,
    isSelected: boolean,
    onSelectChange: (id: string, isSelected: boolean) => void
  ) => ReactElement
  paramMap?: {[key: string]: string}
  queryMap?: {[key: string]: string}
  children?: (props: ListViewChildrenProps) => React.ReactElement
}

export interface ListViewChildrenProps {
  metaInformationDisplay: React.ReactElement
  viewModeToggle: React.ReactElement
  updateQuery: (queryKey: string) => (value: string | boolean | number) => void
  routeParams: any
  queryParams: any
  selected: string[]
  loading: boolean
  children: any
}

const DEFAULT_CARD = (o: any, i: number) => (
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

const DEFAULT_GRID_OPTIONS = {templateColumns: "repeat(3, 1fr)", templateRows: "(3, 1fr)", gap: 4}

const ListView = <T,>({
  service,
  paramMap,
  queryMap,
  tableOptions,
  gridOptions = DEFAULT_GRID_OPTIONS,
  renderCard = DEFAULT_CARD,
  children
}: ListViewProps<T>) => {
  const [data, setData] = useState<(T extends Product ? ListPageWithFacets<T> : ListPage<T>) | undefined>()
  const [viewMode, setViewMode] = useState<"grid" | "table">("table")
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const handleSelectAll = useCallback(() => {
    setSelected((s) => (s.length && s.length === data.Items.length ? [] : data.Items.map((i) => i.ID)))
  }, [data])

  const handleSelectChange = useCallback((id: string, isSelected: boolean) => {
    setSelected((s) => (isSelected ? [...s, id] : s.filter((sid) => sid !== id)))
  }, [])

  const {push, pathname, isReady, query} = useRouter()

  const mapRouterQuery = useCallback(
    (map?: {[key: string]: string}) => {
      let result = {}
      if (!isReady) return result
      if (!map) return result
      Object.entries(query).forEach(([key, val]: [string, string]) => {
        if (map[key]) {
          result[map[key]] = val
        }
      })
      return result
    },
    [query, isReady]
  )

  const params = useMemo(() => {
    return {
      routeParams: mapRouterQuery(paramMap),
      queryParams: mapRouterQuery(queryMap)
    }
  }, [paramMap, queryMap, mapRouterQuery])

  const fetchData = useCallback(async () => {
    let response
    setLoading(true)
    if (Object.values(params.routeParams).length) {
      response = await service(...Object.values(params.routeParams), params.queryParams)
    } else {
      response = await service(params.queryParams)
    }
    setData(response)
    setLoading(false)
  }, [service, params])

  useEffect(() => {
    if (isReady) {
      fetchData()
    }
  }, [fetchData, isReady])

  const viewModeToggle = useMemo(() => {
    return (
      <ButtonGroup isAttached variant="secondaryButton">
        <IconButton
          aria-label="Grid View"
          isActive={viewMode === "grid"}
          icon={<HiOutlineViewGrid />}
          onClick={() => setViewMode("grid")}
        />
        <IconButton
          aria-label="List View"
          isActive={viewMode === "table"}
          icon={<HiOutlineViewList />}
          onClick={() => setViewMode("table")}
        />
      </ButtonGroup>
    )
  }, [viewMode])

  const handleUpdateQuery = useCallback(
    (queryKey: string) => (value: string | boolean | number) => {
      push({pathname: pathname, query: {...query, [queryKey]: value}})
    },
    [push, pathname, query]
  )

  const metaInformationDisplay = useMemo(() => {
    if (!data) return
    return (
      <Text
        alignSelf="center"
        flexShrink={0}
        fontWeight="bold"
      >{`${data.Meta.ItemRange[0]} - ${data.Meta.ItemRange[1]} of ${data.Meta.TotalCount}`}</Text>
    )
  }, [data])

  const renderList = useMemo(() => {
    if (data) {
      if (data.Items.length) {
        const mergedGridOptions = {...DEFAULT_GRID_OPTIONS, ...gridOptions}
        return (
          <Box mb={5}>
            {viewMode === "grid" ? (
              //GRID VIEW
              <Grid as="section" {...mergedGridOptions} w="full" width="100%">
                {data.Items.map((o, i) => (
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
                    {renderCard(o, i, selected.includes(o.ID), handleSelectChange)}
                  </GridItem>
                ))}
              </Grid>
            ) : (
              //TABLE VIEW
              <DataTable
                {...tableOptions}
                data={data.Items}
                selected={selected}
                onSelectChange={handleSelectChange}
                onSelectAll={handleSelectAll}
                currentSort={params.queryParams["SortBy"]}
                // onSortChange={() => console.log("SORT CHANGE")}
              />
            )}
            {/* PAGINATION */}
          </Box>
        )
      }
      //NO RESULTS DISPLAY
    }
    //NONE CREATED DISPLAY
  }, [data, viewMode, gridOptions, renderCard, selected, handleSelectChange])

  const childrenProps = useMemo(() => {
    return {
      viewModeToggle,
      metaInformationDisplay,
      updateQuery: handleUpdateQuery,
      routeParams: params.routeParams,
      queryParams: params.queryParams,
      selected,
      loading,
      children: renderList
    }
  }, [selected, loading, metaInformationDisplay, viewModeToggle, params, handleUpdateQuery, renderList])

  return children(childrenProps)
}

export default ListView
