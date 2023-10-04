import ProtectedContent from "@/components/auth/ProtectedContent"
import {ListViewChildrenProps} from "@/components/shared/ListView/ListView"
import ListViewMetaInfo from "@/components/shared/ListViewMetaInfo/ListViewMetaInfo"
import {Box, Button, Stack} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import Link from "next/link"
import {FC} from "react"

interface BuyerCatalogsListToolbarProps extends Omit<ListViewChildrenProps, "renderContent"> {
  buyerid: string
}

const BuyerCatalogsListToolbar: FC<BuyerCatalogsListToolbarProps> = ({
  meta,
  viewModeToggle,
  updateQuery,
  buyerid,
  filterParams,
  queryParams
}) => {
  return (
    <>
      <Stack direction="row" mb={5}>
        <Box as="span" flexGrow="1"></Box>
        <Stack direction={["column", "column", "column", "row"]}>
          <Stack direction="row" order={[1, 1, 1, 0]}>
            {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
            <Box as="span" width="2"></Box>
            {viewModeToggle}
          </Stack>
          <ProtectedContent hasAccess={appPermissions.BuyerCatalogManager}>
            <Box order={[0, 0, 0, 1]} mt={0}>
              <Link passHref href={`/buyers/${buyerid}/catalogs/new`}>
                <Button variant="solid" colorScheme="primary" as="a" mb={3}>
                  Create Catalog
                </Button>
              </Link>
            </Box>
          </ProtectedContent>
        </Stack>
      </Stack>
    </>
  )
}

export default BuyerCatalogsListToolbar
