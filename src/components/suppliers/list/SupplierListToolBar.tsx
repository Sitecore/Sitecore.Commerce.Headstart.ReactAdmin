import ExportToCsv from "@/components/demo/ExportToCsv"
import DebouncedSearchInput from "@/components/shared/DebouncedSearchInput/DebouncedSearchInput"
import {ListViewChildrenProps} from "@/components/shared/ListView/ListView"
import ListViewMetaInfo from "@/components/shared/ListViewMetaInfo/ListViewMetaInfo"
import {Box, Button, Stack} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import SupplierListActions from "./SupplierListActions"
import SupplierStatusFilter from "./SupplierStatusFilter"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface SupplierListToolbarProps extends Omit<ListViewChildrenProps, "renderContent"> {}

const SupplierListToolbar: FC<SupplierListToolbarProps> = ({
  meta,
  viewModeToggle,
  updateQuery,
  filterParams,
  queryParams
}) => {
  return (
    <Stack direction="row" mb={5} w="full" wrap="wrap" gap={2}>
      <DebouncedSearchInput label="Search suppliers" value={queryParams["Search"]} onSearch={updateQuery("s", true)} />
      <SupplierStatusFilter value={filterParams["Active"]} onChange={updateQuery("active", true)} />
      <ExportToCsv />
      <Stack direction="row" alignItems="center" style={{marginLeft: "auto"}}>
        {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
        <Box as="span" width="2"></Box>
        {viewModeToggle}
        <ProtectedContent hasAccess={appPermissions.SupplierManager}>
          <Link passHref href="/suppliers/new">
            <Button variant="solid" colorScheme="primary" as="a">
              Create Supplier
            </Button>
          </Link>
        </ProtectedContent>
      </Stack>
    </Stack>
  )
}

export default SupplierListToolbar
