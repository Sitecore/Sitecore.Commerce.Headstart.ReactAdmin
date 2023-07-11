import {Box, Button, Stack} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import DebouncedSearchInput from "../../shared/DebouncedSearchInput/DebouncedSearchInput"
import {ListViewChildrenProps} from "../../shared/ListView/ListView"
import ListViewMetaInfo from "../../shared/ListViewMetaInfo/ListViewMetaInfo"
import AdminAddressListActions from "./AdminAddressListActions"

interface AdminAddressListToolbarProps extends Omit<ListViewChildrenProps, "renderContent"> {}

const AdminAddressListToolbar: FC<AdminAddressListToolbarProps> = ({
  meta,
  viewModeToggle,
  updateQuery,
  queryParams
}) => {
  return (
    <>
      <Stack direction="row" mb={5}>
        <Stack direction={["column", "column", "column", "row"]}>
          <DebouncedSearchInput
            label="Search admin addresses"
            value={queryParams["Search"]}
            onSearch={updateQuery("s", true)}
          />
          <Stack direction="row">
            <AdminAddressListActions />
          </Stack>
        </Stack>
        <Box as="span" flexGrow="1"></Box>
        <Stack direction={["column", "column", "column", "row"]}>
          <Stack direction="row" order={[1, 1, 1, 0]}>
            {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
            <Box as="span" width="2"></Box>
            {viewModeToggle}
          </Stack>
          <Box order={[0, 0, 0, 1]} mt={0}>
            <Link passHref href="adminaddresses/new">
              <Button variant="solid" colorScheme="primary" as="a" mb={3}>
                Create Admin Address
              </Button>
            </Link>
          </Box>
        </Stack>
      </Stack>
    </>
  )
}

export default AdminAddressListToolbar
