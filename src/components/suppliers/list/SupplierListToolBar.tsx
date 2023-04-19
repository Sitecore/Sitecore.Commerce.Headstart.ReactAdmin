import ExportToCsv from "@/components/demo/ExportToCsv"
import DebouncedSearchInput from "@/components/shared/DebouncedSearchInput/DebouncedSearchInput"
import {ListViewChildrenProps} from "@/components/shared/ListView/ListView"
import ListViewMetaInfo from "@/components/shared/ListViewMetaInfo/ListViewMetaInfo"
import {Box, Button, Stack} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import SupplierListActions from "./SupplierListActions"
import SupplierStatusFilter from "./SupplierStatusFilter"

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
        <Link passHref href="/suppliers/add">
          <Button variant="solid" colorScheme="primary" as="a" mb={3}>
            Create Supplier
          </Button>
        </Link>
      </Stack>
    </Stack>
  )
}

export default SupplierListToolbar
