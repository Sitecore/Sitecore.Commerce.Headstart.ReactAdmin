import {OrderStatusColorSchemeMap} from "@/components/orders/list/OrderList"
import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import {Box, Container, Tag, Text, useDisclosure} from "@chakra-ui/react"
import Link from "next/link"
import {OrderReturns} from "ordercloud-javascript-sdk"
import {FC, useCallback, useState} from "react"
import {IOrderReturn} from "types/ordercloud/IOrderReturn"
import {dateHelper, priceHelper} from "utils"
import OrderReturnDeleteModal from "../modals/OrderReturnDeleteModal"
import OrderReturnActionMenu from "./OrderReturnActionMenu"
import OrderReturnListToolbar from "./OrderReturnListToolbar"

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
  cell: ({row, value}) => (
    <Link href={`/returns/${value}`} passHref>
      <Text as="a" noOfLines={2} title={value}>
        {value}
      </Text>
    </Link>
  ),
  sortable: true
}

const OrderIdColumn: DataTableColumn<IOrderReturn> = {
  header: "Order ID",
  accessor: "OrderID",
  width: "15%",
  cell: ({row, value}) => (
    <Link href={`/orders/${value}`} passHref>
      <Text as="a" noOfLines={2} title={value}>
        {value}
      </Text>
    </Link>
  ),
  sortable: true
}

const LastUpdatedColumn: DataTableColumn<IOrderReturn> = {
  header: "Last Updated",
  accessor: "Status",
  width: "20%",
  cell: ({row, value}) => (
    <Link href={`/orders/${value}`} passHref>
      {dateHelper.formatDate(row.original[`Date${value}`])}
    </Link>
  )
}

const StatusColumn: DataTableColumn<IOrderReturn> = {
  header: "Status",
  accessor: "Status",
  width: "15%",
  cell: ({row, value}) => (
    <Link href={`/returns/${row.original.ID}`} passHref>
      <Tag as="a" colorScheme={OrderStatusColorSchemeMap[value] || "default"}>
        {value}
      </Tag>
    </Link>
  ),
  sortable: true
}

const NoOfItemsColumn: DataTableColumn<IOrderReturn> = {
  header: "No. of LineItems",
  accessor: "ItemsToReturn",
  width: "5%",
  align: "right",
  cell: ({row, value}) => (
    <Link href={`/returns/${row.original.ID}`} passHref>
      <Text as="a" noOfLines={1} title={value.length}>
        {value.length}
      </Text>
    </Link>
  ),
  sortable: true
}

const RefundAmountColumn: DataTableColumn<IOrderReturn> = {
  header: "Refund Amount",
  accessor: "RefundAmount",
  width: "5%",
  align: "right",
  cell: ({row, value}) => (
    <Link href={`/returns/${value}`} passHref>
      <Text as="a" noOfLines={1} title={value}>
        {priceHelper.formatPrice(value)}
      </Text>
    </Link>
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
  return (
    <ListView<IOrderReturn>
      initialViewMode="table"
      itemActions={renderOrderReturnActionMenu}
      queryMap={OrderReturnQueryMap}
      filterMap={OrderReturnFilterMap}
      service={OrderReturns.List}
      tableOptions={OrderReturnTableOptions}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%">
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
