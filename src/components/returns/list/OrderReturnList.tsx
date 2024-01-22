import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import {Box, Container, Text, useDisclosure} from "@chakra-ui/react"
import {OrderReturns} from "ordercloud-javascript-sdk"
import {FC, useCallback, useState} from "react"
import {IOrderReturn} from "types/ordercloud/IOrderReturn"
import {dateHelper, priceHelper} from "utils"
import OrderReturnDeleteModal from "../modals/OrderReturnDeleteModal"
import OrderReturnActionMenu from "./OrderReturnActionMenu"
import OrderReturnListToolbar from "./OrderReturnListToolbar"
import {OrderStatus} from "@/components/orders/OrderStatus"
import {Link} from "@chakra-ui/next-js"

const OrderReturnQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const OrderReturnFilterMap = {
  status: "Status"
}

const IdColumn: DataTableColumn<IOrderReturn> = {
  header: "ID",
  accessor: "ID",
  width: "15%",
  cell: ({value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const OrderIdColumn: DataTableColumn<IOrderReturn> = {
  header: "Order ID",
  accessor: "OrderID",
  width: "15%",
  hrefResolver: (item) => `/orders/${item.OrderID}`,
  cell: ({value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const LastUpdatedColumn: DataTableColumn<IOrderReturn> = {
  header: "Last Updated",
  accessor: "Status",
  width: "20%",
  cell: ({row, value}) => <Text noOfLines={2}>{dateHelper.formatDate(row.original[`Date${value}`])}</Text>
}

const StatusColumn: DataTableColumn<IOrderReturn> = {
  header: "Status",
  accessor: "Status",
  width: "15%",
  cell: ({row, value}) => (
    <Link href={`/returns/${row.original.ID}`}>
      <OrderStatus status={value} />
    </Link>
  ),
  sortable: true
}

const NoOfItemsColumn: DataTableColumn<IOrderReturn> = {
  header: "No. of LineItems",
  accessor: "ItemsToReturn",
  width: "5%",
  align: "right",
  cell: ({value}) => (
    <Text noOfLines={1} title={value.length}>
      {value.length}
    </Text>
  ),
  sortable: true
}

const RefundAmountColumn: DataTableColumn<IOrderReturn> = {
  header: "Refund Amount",
  accessor: "RefundAmount",
  width: "5%",
  align: "right",
  cell: ({value}) => (
    <Text noOfLines={1} title={value}>
      {priceHelper.formatPrice(value)}
    </Text>
  ),
  sortable: true
}

const OrderReturnTableOptions: ListViewTableOptions<IOrderReturn> = {
  responsive: {
    base: [OrderIdColumn, RefundAmountColumn],
    md: [OrderIdColumn, StatusColumn, RefundAmountColumn],
    lg: [IdColumn, OrderIdColumn, StatusColumn, RefundAmountColumn],
    xl: [IdColumn, OrderIdColumn, StatusColumn, LastUpdatedColumn, RefundAmountColumn, NoOfItemsColumn]
  }
}

const OrderReturnList: FC = () => {
  const [actionOrderReturn, setActionOrderReturn] = useState<IOrderReturn>()
  const editDisclosure = useDisclosure()
  const deleteDisclosure = useDisclosure()

  const renderOrderReturnActionMenu = useCallback(
    (orderReturn: IOrderReturn) => {
      return (
        <OrderReturnActionMenu
          orderReturn={orderReturn}
          onOpen={() => setActionOrderReturn(orderReturn)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [deleteDisclosure.onOpen]
  )

  const resolveOrderReturnDetailHref = (orderReturn: IOrderReturn) => {
    return `/returns/${orderReturn.ID}`
  }

  return (
    <ListView<IOrderReturn>
      initialViewMode="table"
      itemHrefResolver={resolveOrderReturnDetailHref}
      itemActions={renderOrderReturnActionMenu}
      queryMap={OrderReturnQueryMap}
      filterMap={OrderReturnFilterMap}
      service={OrderReturns.List}
      tableOptions={OrderReturnTableOptions}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <OrderReturnListToolbar {...listViewChildProps} onBulkEdit={editDisclosure.onOpen} />
          </Box>
          {renderContent}
          <OrderReturnDeleteModal
            onComplete={listViewChildProps.removeItems}
            orderReturns={
              actionOrderReturn
                ? [actionOrderReturn]
                : items
                ? items.filter((buyer) => listViewChildProps.selected.includes(buyer.ID))
                : []
            }
            disclosure={deleteDisclosure}
          />
        </Container>
      )}
    </ListView>
  )
}

export default OrderReturnList
