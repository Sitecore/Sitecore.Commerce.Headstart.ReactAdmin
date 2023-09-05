import DebouncedSearchInput from "@/components/shared/DebouncedSearchInput/DebouncedSearchInput"
import {ListViewChildrenProps} from "@/components/shared/ListView/ListView"
import ListViewMetaInfo from "@/components/shared/ListViewMetaInfo/ListViewMetaInfo"
import {Box, Button, Stack} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import SecurityProfileListActions from "./SecurityProfileListActions"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface SecurityProfileListToolbarProps extends Omit<ListViewChildrenProps, "renderContent"> {}

const SecurityProfileListToolbar: FC<SecurityProfileListToolbarProps> = ({
  meta,
  viewModeToggle,
  updateQuery,
  filterParams,
  queryParams
}) => {
  return (
    <Stack direction="row" mb={5} w="full" wrap="wrap" gap={2}>
      <DebouncedSearchInput
        label="Search securityprofiles"
        value={queryParams["Search"]}
        onSearch={updateQuery("s", true)}
      />
      <SecurityProfileListActions />
      <Stack direction="row" alignItems="center" style={{marginLeft: "auto"}}>
        {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
        <Box as="span" width="2"></Box>
        {viewModeToggle}
        <ProtectedContent hasAccess={appPermissions.SecurityProfileManager}>
          <Link passHref href="/settings/securityprofiles/new">
            <Button variant="solid" colorScheme="primary" as="a">
              Create Security Profile
            </Button>
          </Link>
        </ProtectedContent>
      </Stack>
    </Stack>
  )
}

export default SecurityProfileListToolbar
