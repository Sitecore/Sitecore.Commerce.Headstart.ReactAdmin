import {Button, Input, InputGroup, InputLeftAddon, Stack} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import DebouncedSearchInput from "../../shared/DebouncedSearchInput/DebouncedSearchInput"
import {ListViewChildrenProps} from "../../shared/ListView/ListView"
import ListViewMetaInfo from "../../shared/ListViewMetaInfo/ListViewMetaInfo"
import OrderStatusFilter from "./OrderStatusFilter"
import OrderListActions from "./OrderListActions"
import {OrderDirectionFilter} from "./OrderDirectionFilter"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface OrderListToolbarProps extends Omit<ListViewChildrenProps, "renderContent"> {
  onBulkEdit: () => void
}

const OrderFromDateFilter = ({value, onChange}: {value: string; onChange: (value: string) => void}) => {
  return (
    <InputGroup maxW={{md: 300}}>
      <InputLeftAddon>From</InputLeftAddon>
      <Input type="date" value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </InputGroup>
  )
}

const OrderToDateFilter = ({value, onChange}: {value: string; onChange: (value: string) => void}) => {
  return (
    <InputGroup maxW={{md: 300}}>
      <InputLeftAddon>To</InputLeftAddon>
      <Input type="date" value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </InputGroup>
  )
}

const OrderListToolbar: FC<OrderListToolbarProps> = ({
  meta,
  viewModeToggle,
  updateQuery,
  onBulkEdit,
  filterParams,
  queryParams,
  routeParams,
  selected
}) => {
  return (
    <>
      <Stack direction="row" mb={5} flexWrap="wrap" gap={10} alignItems="flex-end">
        <Stack direction="column" flexGrow={1}>
          <Stack direction="row">
            <Stack direction="row" flexWrap="wrap">
              <DebouncedSearchInput
                containerProps={{
                  minW: {base: "100%", lg: 200, xl: 400},
                  flex: 0
                }}
                label="Search orders"
                value={queryParams["Search"]}
                onSearch={updateQuery("s", true)}
              />

              <OrderDirectionFilter value={routeParams["Direction"]} onChange={updateQuery("d", true)} />
              <OrderStatusFilter value={filterParams["Status"]} onChange={updateQuery("status", true)} />
              <OrderListActions />
            </Stack>
          </Stack>
          <Stack direction="row" flexWrap={{base: "wrap", md: "nowrap"}}>
            <OrderFromDateFilter value={filterParams["from"]} onChange={updateQuery("from", true)} />
            <OrderToDateFilter value={filterParams["to"]} onChange={updateQuery("to", true)} />
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" ml="auto" minW="max-content" flexWrap="nowrap" gap={6}>
          {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
          <ProtectedContent hasAccess={appPermissions.OrderManager}>
            <Link passHref href="/orders/new">
              <Button variant="solid" colorScheme="primary" as="a">
                Create Order
              </Button>
            </Link>
          </ProtectedContent>
        </Stack>
      </Stack>
    </>
  )
}

export default OrderListToolbar
