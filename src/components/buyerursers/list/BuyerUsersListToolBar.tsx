import DebouncedSearchInput from "@/components/shared/DebouncedSearchInput/DebouncedSearchInput"
import {ListViewChildrenProps} from "@/components/shared/ListView/ListView"
import ListViewMetaInfo from "@/components/shared/ListViewMetaInfo/ListViewMetaInfo"
import {Box, Button, Stack} from "@chakra-ui/react"
import Link from "next/link"
import {FC} from "react"
import BuyerUsersListActions from "./BuyerUsersListActions"
import BuyerUsersStatusFilter from "./BuyerUsersStatusFilter"

interface BuyerUsersListToolbarProps extends Omit<ListViewChildrenProps, "renderContent"> {
  buyerid: string
}

const BuyerUsersListToolbar: FC<BuyerUsersListToolbarProps> = ({
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
        <Stack direction={["column", "column", "column", "row"]}>
          <DebouncedSearchInput
            label="Search usergroup"
            value={queryParams["Search"]}
            onSearch={updateQuery("s", true)}
          />
        </Stack>
        <Stack direction="row">
          <BuyerUsersListActions />
          <BuyerUsersStatusFilter value={filterParams["Active"]} onChange={updateQuery("active", true)} />
        </Stack>
        <Box as="span" flexGrow="1"></Box>
        <Stack direction={["column", "column", "column", "row"]}>
          <Stack direction="row" order={[1, 1, 1, 0]}>
            {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
            <Box as="span" width="2"></Box>
            {viewModeToggle}
          </Stack>
          <Box order={[0, 0, 0, 1]} mt={0}>
            <Link passHref href={`/buyers/${buyerid}/users/add`}>
              <Button variant="solid" colorScheme="primary" as="a" mb={3}>
                Create User
              </Button>
            </Link>
          </Box>
        </Stack>
      </Stack>
    </>
  )
}

export default BuyerUsersListToolbar
