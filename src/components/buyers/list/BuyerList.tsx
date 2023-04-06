import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Icon,
  Image,
  Stack,
  Tag,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react"
import {DataTableColumn} from "@/components/shared/DataTable/DataTable"
import ListView, {ListViewTableOptions} from "@/components/shared/ListView/ListView"
import Link from "next/link"
import {Buyer, Buyers, Catalogs, ListPage, UserGroups, Users} from "ordercloud-javascript-sdk"
import {FC, useCallback, useEffect, useState} from "react"
import {IBuyer} from "types/ordercloud/IBuyer"
import {MdCheck} from "react-icons/md"
import {IoMdClose} from "react-icons/io"
import {dateHelper} from "utils"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"
import {IBuyerUser} from "types/ordercloud/IBuyerUser"
import {useRouter} from "next/router"
import {useSuccessToast} from "hooks/useToast"
import {OrderCloudTableFilters} from "@/components/ordercloud-table"
import DebouncedSearchInput from "@/components/shared/DebouncedSearchInput/DebouncedSearchInput"
import ListViewMetaInfo from "@/components/shared/ListViewMetaInfo/ListViewMetaInfo"

const BuyerList: FC = () => {
  let router = useRouter()
  const [buyersMeta, setBuyersMeta] = useState({})
  const [showList, setShowList] = useState(false)
  const successToast = useSuccessToast()

  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    let _buyerListMeta = {}
    const buyersList = await Buyers.List<IBuyer>(filters)
    const requests = buyersList.Items.map(async (buyer) => {
      const [userGroupsList, usersList, catalogsList] = await Promise.all([
        UserGroups.List<IBuyerUserGroup>(buyer.ID),
        Users.List<IBuyerUser>(buyer.ID),
        Catalogs.ListAssignments({buyerID: buyer.ID})
      ])
      _buyerListMeta[buyer.ID] = {}
      _buyerListMeta[buyer.ID]["userGroupsCount"] = userGroupsList.Meta.TotalCount
      _buyerListMeta[buyer.ID]["usersCount"] = usersList.Meta.TotalCount
      _buyerListMeta[buyer.ID]["catalogsCount"] = catalogsList.Meta.TotalCount
    })
    await Promise.all(requests)
    setBuyersMeta(_buyerListMeta)
    setShowList(true)
  }, [])

  useEffect(() => {
    fetchData({})
  }, [fetchData])

  const deleteBuyer = useCallback(
    async (userId: string) => {
      await Buyers.Delete(userId)
      fetchData({})
      successToast({
        description: "Buyer deleted successfully."
      })
    },
    [fetchData, successToast]
  )

  const paramMap = {
    d: "Direction"
  }

  const BuyerQueryMap = {
    s: "Search",
    sort: "SortBy",
    p: "Page"
  }

  const IdColumn: DataTableColumn<IBuyer> = {
    header: "Buyer ID",
    accessor: "ID",
    cell: ({row, value}) => (
      <Link passHref href={"/buyers/" + row.original.ID}>
        <Text as="a" noOfLines={2} title={value}>
          {value}
        </Text>
      </Link>
    )
  }

  const NameColumn: DataTableColumn<IBuyer> = {
    header: "NAME",
    accessor: "Name",
    cell: ({row, value}) => (
      <Link passHref href={"/buyers/" + row.original.ID}>
        <Text as="a" noOfLines={2} title={value}>
          {value}
        </Text>
      </Link>
    )
  }

  const DefaultCatalogIDColumn: DataTableColumn<IBuyer> = {
    header: "DEFAULT CATALOG ID",
    accessor: "DefaultCatalogID"
  }

  const StatusColumn: DataTableColumn<IBuyer> = {
    header: "STATUS",
    accessor: "Active",
    cell: ({row}) => (
      <>
        <Icon
          as={row.original.Active === true ? MdCheck : IoMdClose}
          color={row.original.Active === true ? "green.400" : "red.400"}
          w="20px"
          h="20px"
        />
        <Text>{row.original.Active ? "Active" : "Non active"}</Text>
      </>
    )
  }

  const CreatedDateColumn: DataTableColumn<IBuyer> = {
    header: "CREATED DATE",
    accessor: "DateCreated",
    cell: ({value}) => dateHelper.formatDate(value)
  }

  const UserGroupColumn: DataTableColumn<IBuyer> = {
    header: "USER GROUPS / USERS",
    cell: ({row}) => (
      <ButtonGroup>
        <Button onClick={() => router.push(`/buyers/${row.original.ID}/usergroups`)} variant="outline">
          User Groups ({buyersMeta[row.original.ID]["userGroupsCount"]})
        </Button>
        <Button onClick={() => router.push(`/buyers/${row.original.ID}/users`)} variant="outline">
          Users ({buyersMeta[row.original.ID]["usersCount"]})
        </Button>
      </ButtonGroup>
    )
  }

  const CatalogColumn: DataTableColumn<IBuyer> = {
    header: "CATALOGS",
    cell: ({row}) => (
      <Link href={`/buyers/${row.original.ID}/catalogs`}>
        <Button variant="outline">Catalogs ({buyersMeta[row.original.ID]["catalogsCount"]})</Button>
      </Link>
    )
  }

  const ActionsColumn: DataTableColumn<IBuyer> = {
    header: "ACTIONS",
    cell: ({row}) => (
      <ButtonGroup>
        <Button variant="outline" onClick={() => router.push(`/buyers/${row.original.ID}/`)}>
          Edit
        </Button>
        <Button variant="outline" onClick={() => deleteBuyer(row.original.ID)}>
          Delete
        </Button>
      </ButtonGroup>
    )
  }

  const BuyerTableOptions: ListViewTableOptions<IBuyer> = {
    responsive: {
      base: [IdColumn, NameColumn],
      md: [IdColumn, NameColumn],
      lg: [IdColumn, NameColumn],
      xl: [
        IdColumn,
        NameColumn,
        DefaultCatalogIDColumn,
        StatusColumn,
        CreatedDateColumn,
        UserGroupColumn,
        CatalogColumn,
        ActionsColumn
      ]
    }
  }

  return (
    showList && (
      <ListView<IBuyer>
        service={Buyers.List}
        tableOptions={BuyerTableOptions}
        paramMap={paramMap}
        queryMap={BuyerQueryMap}
      >
        {({renderContent, meta, updateQuery, queryParams, viewModeToggle, ...listViewChildProps}) => (
          <Container maxW="100%">
            <Box>
              <Stack direction="row" mb={5}>
                <Stack direction={["column", "column", "column", "row"]}>
                  <DebouncedSearchInput
                    label="Search buyers"
                    value={queryParams["Search"]}
                    onSearch={updateQuery("s", true)}
                  />
                </Stack>
                <Box as="span" flexGrow="1"></Box>
                <Stack direction={["column", "column", "column", "row"]}>
                  <Stack direction="row" order={[1, 1, 1, 0]}>
                    {meta && <ListViewMetaInfo range={meta.ItemRange} total={meta.TotalCount} />}
                    <Box as="span" width="2"></Box>
                    {viewModeToggle}
                  </Stack>
                  <Box order={[0, 0, 0, 1]} mt={0}>
                    <Link passHref href="/buyers/add">
                      <Button variant="solid" colorScheme="primary" as="a" mb={3}>
                        Create Buyer
                      </Button>
                    </Link>
                  </Box>
                </Stack>
              </Stack>
            </Box>
            {renderContent}
          </Container>
        )}
      </ListView>
    )
  )
}

export default BuyerList
