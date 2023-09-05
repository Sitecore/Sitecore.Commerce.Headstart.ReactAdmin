import ExportToCsv from "@/components/demo/ExportToCsv"
import DebouncedSearchInput from "@/components/shared/DebouncedSearchInput/DebouncedSearchInput"
import {ListViewChildrenProps} from "@/components/shared/ListView/ListView"
import ListViewMetaInfo from "@/components/shared/ListViewMetaInfo/ListViewMetaInfo"
import {Box, Button, Stack} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import BuyerListActions from "./BuyerListActions"
import BuyerStatusFilter from "./BuyerStatusFilter"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

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
      <BuyerListActions />
      <Stack direction="row" alignItems="center" style={{marginLeft: "auto"}}>
        {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
        <Box as="span" width="2"></Box>
        {viewModeToggle}
        <ProtectedContent hasAccess={appPermissions.BuyerManager}>
          <Link passHref href="/buyers/new">
            <Button variant="solid" colorScheme="primary" as="a">
              Create Buyer
            </Button>
          </Link>
        </ProtectedContent>
      </Stack>
    </Stack>
  )
}

export default BuyerListToolbar
