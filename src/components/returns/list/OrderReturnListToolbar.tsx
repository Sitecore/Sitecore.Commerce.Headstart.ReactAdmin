import {Box, Button, Stack, Text} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import DebouncedSearchInput from "../../shared/DebouncedSearchInput/DebouncedSearchInput"
import {ListViewChildrenProps} from "../../shared/ListView/ListView"
import ListViewMetaInfo from "../../shared/ListViewMetaInfo/ListViewMetaInfo"
import OrderReturnStatusFilter from "./OrderReturnStatusFilter"
import OrderReturnListActions from "./OrderReturnListActions"

interface OrderReturnListToolbarProps extends Omit<ListViewChildrenProps, "renderContent"> {
  onBulkEdit: () => void
}

const OrderReturnListToolbar: FC<OrderReturnListToolbarProps> = ({
  meta,
  viewModeToggle,
  updateQuery,
  onBulkEdit,
  filterParams,
  queryParams,
  selected
}) => {
  return (
    <>
      <Stack direction="row" mb={5}>
        <Stack direction={["column", "column", "column", "row"]}>
          <DebouncedSearchInput
            label="Search order returns"
            value={queryParams["Search"]}
            onSearch={updateQuery("s", true)}
          />
          <Stack direction="row">
            <OrderReturnStatusFilter value={filterParams["Status"]} onChange={updateQuery("status", true)} />
            <OrderReturnListActions />
          </Stack>
        </Stack>
        <Box as="span" flexGrow="1"></Box>
        <Stack direction={["column", "column", "column", "row"]} alignItems="center">
          <Stack direction="row" order={[1, 1, 1, 0]} alignItems="center">
            {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
            <Box as="span" width="2"></Box>
          </Stack>
          {/* <Box order={[0, 0, 0, 1]} mt={0}>
            <Link passHref href="/products/new">
              <Button variant="solid" colorScheme="primary" as="a">
                Create Return
              </Button>
            </Link>
          </Box> */}
        </Stack>
      </Stack>
    </>
  )
}

export default OrderReturnListToolbar
