import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import {Box, Container, Tag, Text, useDisclosure} from "@chakra-ui/react"
import Link from "next/link"
import {Orders} from "ordercloud-javascript-sdk"
import {FC, useCallback, useState} from "react"
import {IOrder} from "types/ordercloud/IOrder"
import {dateHelper, priceHelper} from "utils"
import OrderDeleteModal from "../modals/OrderDeleteModal"
import OrderActionMenu from "./OrderActionMenu"
import OrderListToolbar from "./OrderListToolbar"

export const OrderStatusColorSchemeMap = {
  "": "gray",
  Unsubmitted: "info",
  Open: "info",
  AwaitingApproval: "warning",
  Canceled: "danger",
  Declined: "danger",
  Completed: "success"
}

const OrderParamMap = {
  d: "Direction"
}

const OrderQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const OrderFilterMap = {
  status: "Status"
}

const IdColumn: DataTableColumn<IOrder> = {
  header: "ID",
  accessor: "ID",
  width: "15%",
  cell: ({row, value}) => (
    <Link href={`/orders/${value}`} passHref>
      <Text as="a" noOfLines={1} wordBreak="break-all" title={value}>
        {value}
      </Text>
    </Link>
  ),
  sortable: true
}

const CustomerNameColumn: DataTableColumn<IOrder> = {
  header: "Customer Name",
  accessor: "FromUser",
  width: "20%",
  cell: ({row, value}) => (
    <Link href={`/orders/${row.original.ID}`} passHref>
      <Text as="a" noOfLines={2} title={value}>
        {`${value.FirstName} ${value.LastName}`}
      </Text>
    </Link>
  )
}
const CustomerEmailColumn: DataTableColumn<IOrder> = {
  header: "Customer Email",
  accessor: "FromUser.Email",
  width: "20%",
  cell: ({row, value}) => (
    <Link href={`/orders/${row.original.ID}`} passHref>
      <Text as="a" noOfLines={2} title={value}>
        {value || "N/A"}
      </Text>
    </Link>
  ),
  sortable: true
}

const DateSubmittedColumn: DataTableColumn<IOrder> = {
  header: "Submitted On",
  accessor: "DateSubmitted",
  width: "20%",
  cell: ({row, value}) => (
    <Link href={`/orders/${row.original.ID}`} passHref>
      {dateHelper.formatDate(value)}
    </Link>
  ),
  sortable: true
}

const StatusColumn: DataTableColumn<IOrder> = {
  header: "Status",
  accessor: "Status",
  width: "15%",
  cell: ({row, value}) => (
    <Link href={`/orders/${row.original.ID}`} passHref>
      <Tag as="a" colorScheme={OrderStatusColorSchemeMap[value] || "default"}>
        {value}
      </Tag>
    </Link>
  ),
  sortable: true
}

const TotalColumn: DataTableColumn<IOrder> = {
  header: "Total",
  accessor: "Total",
  width: "5%",
  align: "right",
  cell: ({row, value}) => (
    <Link href={`/orders/${value}`} passHref>
      <Text as="a" noOfLines={1} title={value}>
        {priceHelper.formatPrice(value)}
      </Text>
    </Link>
  ),
  sortable: true
}

const OrderReturnTableOptions: ListViewTableOptions<IOrder> = {
  responsive: {
    base: [IdColumn, StatusColumn],
    md: [IdColumn, StatusColumn, TotalColumn],
    lg: [IdColumn, CustomerEmailColumn, StatusColumn, TotalColumn],
    xl: [IdColumn, CustomerNameColumn, CustomerEmailColumn, StatusColumn, DateSubmittedColumn, TotalColumn]
  }
}

const OrderList: FC = () => {
  const [actionOrder, setActionOrder] = useState<IOrder>()
  const editDisclosure = useDisclosure()
  const deleteDisclosure = useDisclosure()

  const renderOrderReturnActionMenu = useCallback(
    (order: IOrder) => {
      return <OrderActionMenu order={order} onOpen={() => setActionOrder(order)} onDelete={deleteDisclosure.onOpen} />
    },
    [deleteDisclosure.onOpen]
  )
  return (
    <ListView<IOrder>
      service={Orders.List}
      tableOptions={OrderReturnTableOptions}
      itemActions={renderOrderReturnActionMenu}
      paramMap={OrderParamMap}
      queryMap={OrderQueryMap}
      filterMap={OrderFilterMap}
      defaultServiceOptions={{parameters: ["Incoming"]}}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <OrderListToolbar {...listViewChildProps} onBulkEdit={editDisclosure.onOpen} />
          </Box>
          {renderContent}
          <OrderDeleteModal
            onComplete={listViewChildProps.removeItems}
            orderReturns={
              actionOrder
                ? [actionOrder]
                : items
                ? items.filter((order) => listViewChildProps.selected.includes(order.ID))
                : []
            }
            disclosure={deleteDisclosure}
          />
        </Container>
      )}
    </ListView>
  )
}

export default OrderList
