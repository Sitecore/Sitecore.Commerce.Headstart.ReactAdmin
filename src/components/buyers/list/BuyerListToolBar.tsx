import DebouncedSearchInput from "@/components/shared/DebouncedSearchInput/DebouncedSearchInput"
import {ListViewChildrenProps} from "@/components/shared/ListView/ListView"
import ListViewMetaInfo from "@/components/shared/ListViewMetaInfo/ListViewMetaInfo"
import {Box, Button, Stack} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import BuyerListActions from "./BuyerListActions"
import BuyerStatusFilter from "./BuyerStatusFilter"

interface BuyerListToolbarProps extends Omit<ListViewChildrenProps, "renderContent"> {}

const BuyerListToolbar: FC<BuyerListToolbarProps> = ({
  meta,
  viewModeToggle,
  updateQuery,
  filterParams,
  queryParams
}) => {
  return (
    <>
      <Stack direction="row" mb={5}>
        <Stack direction={["column", "column", "column", "row"]}>
          <DebouncedSearchInput label="Search buyers" value={queryParams["Search"]} onSearch={updateQuery("s", true)} />
        </Stack>
        <Stack direction="row">
          <BuyerStatusFilter value={filterParams["Active"]} onChange={updateQuery("active", true)} />
          <BuyerListActions />
        </Stack>
        <Box as="span" flexGrow="1"></Box>
        <Stack direction={["column", "column", "column", "row"]}>
          <Stack direction="row" order={[1, 1, 1, 0]}>
            {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
            <Box as="span" width="2"></Box>
            {viewModeToggle}
          </Stack>
          <Box order={[0, 0, 0, 1]} mt={0}>
            <Link passHref href="/buyers/add">
              <Button variant="solid" colorScheme="primary" as="a" mb={3}>
                Create Buyer
              </Button>
            </Link>
          </Box>
        </Stack>
      </Stack>
    </>
  )
}

export default BuyerListToolbar
