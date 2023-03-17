import {Box, ButtonGroup, IconButton, Text} from "@chakra-ui/react"
import {useRouter} from "next/router"
import {ListPage, ListPageWithFacets, Product} from "ordercloud-javascript-sdk"
import {ReactElement, useCallback, useEffect, useMemo, useState} from "react"
import {HiOutlineViewGrid, HiOutlineViewList} from "react-icons/hi"
import DataGrid, {IDataGrid} from "../DataGrid/DataGrid"
import DataTable, {IDataTable} from "../DataTable/DataTable"

export interface IDefaultResource {
  ID?: string
  Name?: string
}

export interface ListViewTableOptions<T>
  extends Omit<IDataTable<T>, "data" | "selected" | "handleSelectionChange" | "rowActions"> {}

export interface ListViewGridOptions<T>
  extends Omit<IDataGrid<T>, "data" | "selected" | "handleSelectionChange" | "gridItemActions"> {}

interface IListView<T, F = any> {
  service?: (...args) => Promise<T extends Product ? ListPageWithFacets<T, F> : ListPage<T>>
  itemActions: (item: T) => ReactElement
  tableOptions: ListViewTableOptions<T>
  gridOptions?: ListViewGridOptions<T>
  paramMap?: {[key: string]: string}
  queryMap?: {[key: string]: string}
  children?: (props: ListViewChildrenProps) => ReactElement
}

export interface ListViewChildrenProps {
  metaInformationDisplay: React.ReactElement
  viewModeToggle: React.ReactElement
  updateQuery: (queryKey: string) => (value: string | boolean | number) => void
  routeParams: any
  queryParams: any
  selected: string[]
  loading: boolean
  renderContent: ReactElement | ReactElement[]
}

const ListView = <T extends IDefaultResource>({
  service,
  paramMap,
  queryMap,
  itemActions,
  tableOptions,
  gridOptions,
  children
}: IListView<T>) => {
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

  const renderContent = useMemo(() => {
    if (data) {
      if (data.Items.length) {
        return (
          <Box mb={5}>
            {viewMode === "grid" ? (
              //GRID VIEW
              <DataGrid
                {...gridOptions}
                gridItemActions={itemActions}
                data={data.Items}
                selected={selected}
                onSelectChange={handleSelectChange}
              />
            ) : (
              //TABLE VIEW
              <DataTable
                {...tableOptions}
                rowActions={itemActions}
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
  }, [data, viewMode, itemActions, tableOptions, gridOptions, params, selected, handleSelectChange, handleSelectAll])

  const childrenProps = useMemo(() => {
    return {
      viewModeToggle,
      metaInformationDisplay,
      updateQuery: handleUpdateQuery,
      routeParams: params.routeParams,
      queryParams: params.queryParams,
      selected,
      loading,
      renderContent
    }
  }, [selected, loading, metaInformationDisplay, viewModeToggle, params, handleUpdateQuery, renderContent])

  return children(childrenProps)
}

export default ListView
