import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import {Box, Container, Text, useDisclosure} from "@chakra-ui/react"
import {OrderDirection, Orders} from "ordercloud-javascript-sdk"
import {FC, useCallback, useState} from "react"
import {IOrder} from "types/ordercloud/IOrder"
import {dateHelper, priceHelper} from "utils"
import OrderDeleteModal from "../modals/OrderDeleteModal"
import OrderActionMenu from "./OrderActionMenu"
import OrderListToolbar from "./OrderListToolbar"
import {OrderStatus} from "../OrderStatus"
import {useAuth} from "hooks/useAuth"

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
  status: "Status",
  from: "from",
  to: "to"
}

const OrderDefaultServiceOptions = {parameters: ["Incoming"]}

const IdColumn: DataTableColumn<IOrder> = {
  header: "ID",
  accessor: "ID",
  width: "15%",
  cell: ({value}) => (
    <Text noOfLines={1} wordBreak="break-all" title={value}>
      {value}
    </Text>
  ),
  sortable: true
}

const CustomerNameColumn: DataTableColumn<IOrder> = {
  header: "Customer Name",
  accessor: "FromUser",
  width: "20%",
  cell: ({value}) => (
    <Text noOfLines={2} title={value}>
      {`${value.FirstName} ${value.LastName}`}
    </Text>
  )
}

const CustomerEmailColumn: DataTableColumn<IOrder> = {
  header: "Customer Email",
  accessor: "FromUser.Email",
  width: "20%",
  cell: ({value}) => (
    <Text noOfLines={2} title={value}>
      {value || "N/A"}
    </Text>
  ),
  sortable: true
}

const DateSubmittedColumn: DataTableColumn<IOrder> = {
  header: "Submitted On",
  accessor: "DateSubmitted",
  width: "15%",
  cell: ({value}) => <Text noOfLines={2}>{dateHelper.formatDate(value)}</Text>,
  sortable: true
}

const SupplierIdColumn: DataTableColumn<IOrder> = {
  header: "Supplier ID",
  accessor: "ToCompanyID",
  width: "10%",
  sortable: true
}

const BuyerIdColumn: DataTableColumn<IOrder> = {
  header: "Buyer ID",
  accessor: "FromCompanyID",
  width: "10%",
  sortable: true
}

const StatusColumn: DataTableColumn<IOrder> = {
  header: "Status",
  accessor: "Status",
  width: "15%",
  cell: ({value}) => <OrderStatus status={value} />,
  sortable: true
}

const TotalColumn: DataTableColumn<IOrder> = {
  header: "Total",
  accessor: "Total",
  width: "5%",
  cell: ({value}) => (
    <Text noOfLines={1} title={value}>
      {priceHelper.formatPrice(value)}
    </Text>
  ),
  sortable: true
}

const NumLineItemsColumn: DataTableColumn<IOrder> = {
  header: "# of line items",
  accessor: "LineItemCount",
  width: "10%",
  sortable: false
}

const OrderList: FC = () => {
  const [actionOrder, setActionOrder] = useState<IOrder>()
  const editDisclosure = useDisclosure()
  const deleteDisclosure = useDisclosure()
  const {isSupplier} = useAuth()

  // For supplier orders, the order will always be from the admin user
  // so its not very helpful to include the customer informtion, omitting for now
  // we may add this once direct buyer => supplier orders are supported
  const OrderReturnTableOptions: ListViewTableOptions<IOrder> = {
    responsive: {
      base: [IdColumn, StatusColumn],
      md: [IdColumn, StatusColumn, TotalColumn],
      lg: isSupplier
        ? [IdColumn, DateSubmittedColumn, StatusColumn, TotalColumn]
        : [IdColumn, CustomerEmailColumn, StatusColumn, TotalColumn],
      xl: isSupplier
        ? [IdColumn, DateSubmittedColumn, StatusColumn, TotalColumn, NumLineItemsColumn]
        : [
            IdColumn,
            DateSubmittedColumn,
            BuyerIdColumn,
            SupplierIdColumn,
            CustomerNameColumn,
            CustomerEmailColumn,
            StatusColumn,
            TotalColumn,
            NumLineItemsColumn
          ]
    },
    hideColumns: (column, params) => {
      const isAdmin = !isSupplier
      if (isAdmin) {
        if (!params.routeParams.Direction || params.routeParams.Direction === "Incoming") {
          return column.accessor === SupplierIdColumn.accessor
        } else {
          return (
            column.accessor === BuyerIdColumn.accessor ||
            column.accessor === CustomerNameColumn.accessor ||
            column.accessor === CustomerEmailColumn.accessor
          )
        }
      }
    }
  }

  const renderOrderReturnActionMenu = useCallback(
    (order: IOrder) => {
      return <OrderActionMenu order={order} onOpen={() => setActionOrder(order)} onDelete={deleteDisclosure.onOpen} />
    },
    [deleteDisclosure.onOpen]
  )

  const resolveOrderDetailHref = (order: IOrder) => {
    return `/orders/${order.ID}`
  }

  return (
    <ListView<IOrder>
      service={Orders.List}
      tableOptions={OrderReturnTableOptions}
      itemActions={renderOrderReturnActionMenu}
      paramMap={OrderParamMap}
      queryMap={OrderQueryMap}
      filterMap={OrderFilterMap}
      itemHrefResolver={resolveOrderDetailHref}
      defaultServiceOptions={OrderDefaultServiceOptions}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <OrderListToolbar {...listViewChildProps} onBulkEdit={editDisclosure.onOpen} />
          </Box>
          {renderContent}
          <OrderDeleteModal
            onComplete={listViewChildProps.removeItems}
            orderDirection={listViewChildProps.routeParams.Direction as OrderDirection}
            orders={
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
