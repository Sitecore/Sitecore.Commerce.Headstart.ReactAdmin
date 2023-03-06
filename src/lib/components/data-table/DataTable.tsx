import {OrderCloudTable, OrderCloudTableFilters} from "../ordercloud-table"
import {ReactTable} from "../react-table/ReactTable"

interface DataTableProps {
  columns
  data
  filters?: OrderCloudTableFilters
  fetchData?: (filters: OrderCloudTableFilters) => Promise<void>
}
/**
 * ReactTable is a table component with clientside pagination/search suitable for non-ordercloud data
 * OrderCloudTable is a table component that handles server side pagination/search and is built with ordercloud api in mind
 *
 * This high level component is used as a common interface for the two so that implementors can easily use one or the other
 * with greater ease. If you need a quick demo and don't care if data is filtered server side then simply pass in columns and data
 * otherwise pass in columns, data, filters, and fetchData
 */
export function DataTable(props: DataTableProps) {
  if (props.fetchData && props.filters) {
    return <OrderCloudTable {...(props as any)} />
  }
  return <ReactTable columns={props.columns} data={props.data?.Items || props.data || []} />
}
