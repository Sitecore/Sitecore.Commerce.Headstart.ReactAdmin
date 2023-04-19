import ExportToCsv from "@/components/demo/ExportToCsv"
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
    <Stack direction="row" mb={5} w="full" wrap="wrap" gap={2}>
      <DebouncedSearchInput label="Search buyers" value={queryParams["Search"]} onSearch={updateQuery("s", true)} />
      <BuyerStatusFilter value={filterParams["Active"]} onChange={updateQuery("active", true)} />
      <ExportToCsv variant="menuitem" />
      {/* <BuyerListActions /> */}
      <Stack direction="row" alignItems="center" style={{marginLeft: "auto"}}>
        {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
        <Box as="span" width="2"></Box>
        {viewModeToggle}
        <Link passHref href="/buyers/add">
          <Button variant="solid" colorScheme="primary" as="a" mb={3}>
            Create Buyer
          </Button>
        </Link>
      </Stack>
    </Stack>
  )
}

export default BuyerListToolbar
