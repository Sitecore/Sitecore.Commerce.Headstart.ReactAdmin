import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import Link from "next/link"
import {Orders} from "ordercloud-javascript-sdk"
import {FC} from "react"
import {IOrder} from "types/ordercloud/IOrder"
import {dateHelper, priceHelper} from "utils"

const tableOptions: ListViewTableOptions<IOrder> = {
  columns: [
    {
      header: "ORDER ID",
      accessor: "ID",
      cell: ({value, row}) => <Link href={`/orders/${row.original.ID}`}>{value}</Link>
    },
    {
      header: "DATE SUBMITTED",
      accessor: "DateSubmitted",
      cell: ({value}) => dateHelper.formatDate(value)
    },
    {
      header: "STATUS",
      accessor: "Status"
    },
    {
      header: "CUSTOMER",
      accessor: "FromUserID",
      cell: ({row}) => `${row.original.FromUser.FirstName} ${row.original.FromUser.LastName}`
    },
    {
      header: "# OF LINE ITEMS",
      accessor: "LineItemCount"
    },
    {
      header: "TOTAL",
      accessor: "Total",
      cell: ({value}) => priceHelper.formatPrice(value)
    }
  ]
}

const paramMap = {
  d: "Direction"
}

const OrderList: FC = () => {
  return (
    <ListView<IOrder>
      service={Orders.List}
      tableOptions={tableOptions}
      paramMap={paramMap}
      defaultServiceOptions={{parameters: ["Incoming"]}}
    >
      {({renderContent, ...listViewOptions}) => <>{renderContent}</>}
    </ListView>
  )
}

export default OrderList
