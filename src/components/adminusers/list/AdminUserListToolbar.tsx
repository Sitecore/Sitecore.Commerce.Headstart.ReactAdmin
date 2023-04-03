import {Box, Button, Stack} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import DebouncedSearchInput from "../../shared/DebouncedSearchInput/DebouncedSearchInput"
import {ListViewChildrenProps} from "../../shared/ListView/ListView"
import ListViewMetaInfo from "../../shared/ListViewMetaInfo/ListViewMetaInfo"
import AdminUserListActions from "./AdminUserListActions"
import AdminUserStatusFilter from "./AdminUserStatusFilter"

interface AdminUserListToolbarProps extends Omit<ListViewChildrenProps, "renderContent"> {}

const AdminUserListToolbar: FC<AdminUserListToolbarProps> = ({
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
          <DebouncedSearchInput
            label="Search admin users"
            value={queryParams["Search"]}
            onSearch={updateQuery("s", true)}
          />
          <Stack direction="row">
            <AdminUserStatusFilter value={filterParams["Active"]} onChange={updateQuery("active", true)} />
            <AdminUserListActions />
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
            <Link passHref href="adminusers/new">
              <Button variant="solid" colorScheme="primary" as="a" mb={3}>
                Create Admin User
              </Button>
            </Link>
          </Box>
        </Stack>
      </Stack>
    </>
  )
}

export default AdminUserListToolbar
