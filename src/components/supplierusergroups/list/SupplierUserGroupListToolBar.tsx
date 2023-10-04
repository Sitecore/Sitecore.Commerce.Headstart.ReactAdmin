import DebouncedSearchInput from "@/components/shared/DebouncedSearchInput/DebouncedSearchInput"
import {ListViewChildrenProps} from "@/components/shared/ListView/ListView"
import ListViewMetaInfo from "@/components/shared/ListViewMetaInfo/ListViewMetaInfo"
import {Box, Button, Stack} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import SupplierUserGroupListActions from "./SupplierUserGroupListActions"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface SupplierUserGroupListToolbarProps extends Omit<ListViewChildrenProps, "renderContent"> {
  supplierid: string
}

const SupplierUserGroupListToolbar: FC<SupplierUserGroupListToolbarProps> = ({
  meta,
  viewModeToggle,
  updateQuery,
  supplierid,
  queryParams
}) => {
  return (
    <>
      <Stack direction="row" mb={5}>
        <Stack direction={["column", "column", "column", "row"]}>
          <DebouncedSearchInput
            label="Search usergroup"
            value={queryParams["Search"]}
            onSearch={updateQuery("s", true)}
          />
        </Stack>
        <Stack direction="row">
          <SupplierUserGroupListActions />
        </Stack>
        <Box as="span" flexGrow="1"></Box>
        <Stack direction={["column", "column", "column", "row"]}>
          <Stack direction="row" order={[1, 1, 1, 0]}>
            {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
            <Box as="span" width="2"></Box>
            {viewModeToggle}
          </Stack>
          <ProtectedContent hasAccess={appPermissions.SupplierUserGroupManager}>
            <Box order={[0, 0, 0, 1]} mt={0}>
              <Link passHref href={`/suppliers/${supplierid}/usergroups/new`}>
                <Button variant="solid" colorScheme="primary" as="a" mb={3}>
                  Create User Group
                </Button>
              </Link>
            </Box>
          </ProtectedContent>
        </Stack>
      </Stack>
    </>
  )
}

export default SupplierUserGroupListToolbar
