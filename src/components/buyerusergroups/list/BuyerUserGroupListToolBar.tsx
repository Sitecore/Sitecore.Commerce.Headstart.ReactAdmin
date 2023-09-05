import DebouncedSearchInput from "@/components/shared/DebouncedSearchInput/DebouncedSearchInput"
import {ListViewChildrenProps} from "@/components/shared/ListView/ListView"
import ListViewMetaInfo from "@/components/shared/ListViewMetaInfo/ListViewMetaInfo"
import {Box, Button, Stack} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import BuyerUserGroupListActions from "./BuyerUserGroupListActions"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface BuyerUserGroupListToolbarProps extends Omit<ListViewChildrenProps, "renderContent"> {
  buyerid: string
}

const BuyerUserGroupListToolbar: FC<BuyerUserGroupListToolbarProps> = ({
  meta,
  viewModeToggle,
  updateQuery,
  buyerid,
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
          <BuyerUserGroupListActions />
        </Stack>
        <Box as="span" flexGrow="1"></Box>
        <Stack direction={["column", "column", "column", "row"]}>
          <Stack direction="row" order={[1, 1, 1, 0]} alignItems="center">
            {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
            {viewModeToggle}
          </Stack>
          <ProtectedContent hasAccess={appPermissions.BuyerUserManager}>
            <Box order={[0, 0, 0, 1]}>
              <Link passHref href={`/buyers/${buyerid}/usergroups/new`}>
                <Button variant="solid" colorScheme="primary" as="a">
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

export default BuyerUserGroupListToolbar
