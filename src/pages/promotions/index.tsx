import {Badge, Box, Button, ButtonGroup, HStack, Icon, Stack} from "@chakra-ui/react"
import {ListPage, Promotion, Promotions} from "ordercloud-javascript-sdk"
import {useCallback, useEffect, useMemo, useRef, useState} from "react"

import Card from "components/card/Card"
import {DataTable} from "components/data-table/DataTable"
import ExportToCsv from "components/demo/ExportToCsv"
import {IPromotion} from "types/ordercloud/IPromotion"
import {IoMdClose} from "react-icons/io"
import {Link} from "components/navigation/Link"
import {MdCheck} from "react-icons/md"
import {OrderCloudTableFilters} from "components/ordercloud-table"
import ProtectedContent from "components/auth/ProtectedContent"
import React from "react"
import {appPermissions} from "constants/app-permissions.config"
import {dateHelper} from "utils/date.utils"
import router from "next/router"
import {useSuccessToast} from "hooks/useToast"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getStaticProps() {
  return {
    props: {
      header: {
        title: "Promotions List",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

const PromotionsList = () => {
  const successToast = useSuccessToast()
  const [tableData, setTableData] = useState(null as ListPage<Promotion>)
  const [filters, setFilters] = useState({} as OrderCloudTableFilters)
  const fetchData = useCallback(async (filters: OrderCloudTableFilters) => {
    setFilters(filters)
    const promotionsList = await Promotions.List<IPromotion>(filters)
    setTableData(promotionsList)
  }, [])

  useEffect(() => {
    fetchData({})
  }, [fetchData])

  const deletePromotion = useCallback(
    async (promotionId: string) => {
      await Promotions.Delete(promotionId)
      fetchData({})
      successToast({
        description: "Promotion deleted successfully."
      })
    },
    [fetchData, successToast]
  )

  const columnsData = useMemo(
    () => [
      {
        Header: "Promotion ID",
        accessor: "ID",
        Cell: ({value, row}) => <Link href={`/promotions/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "Name",
        accessor: "Name",
        Cell: ({value, row}) => <Link href={`/promotions/${row.original.ID}`}>{value}</Link>
      },
      {
        Header: "Code",
        accessor: "Code"
      },
      {
        Header: "Line Item Level?",
        accessor: "LineItemLevel",
        Cell: ({value}) => (
          <>
            <Icon
              as={value === true ? MdCheck : IoMdClose}
              color={value === true ? "green.400" : "red.400"}
              w="20px"
              h="20px"
            />
          </>
        )
      },
      {
        Header: "Can combine?",
        accessor: "CanCombine",
        Cell: ({value}) => (
          <>
            <Icon
              as={value === true ? MdCheck : IoMdClose}
              color={value === true ? "green.400" : "red.400"}
              w="20px"
              h="20px"
            />
          </>
        )
      },
      {
        Header: "Allow All Buyers?",
        accessor: "AllowAllBuyers",
        Cell: ({value}) => (
          <>
            <Icon
              as={value === true ? MdCheck : IoMdClose}
              color={value === true ? "green.400" : "red.400"}
              w="20px"
              h="20px"
            />
          </>
        )
      },
      {
        Header: "Start Date",
        accessor: "StartDate",
        Cell: ({value}) => dateHelper.formatDate(value)
      },
      {
        Header: "Expiration Date",
        accessor: "Expiration Date",
        Cell: ({value}) => (value ? dateHelper.formatDate(value) : "No Expiration")
      },
      {
        Header: "Redemption Limit",
        Cell: ({row}) => (
          <>
            <Stack direction="row">
              <Badge colorScheme="green">{row.original.RedemptionLimit}</Badge>
              <Badge colorScheme="purpple">{row.original.RedemptionLimitPerUser}</Badge>
              <Badge colorScheme="gray">{row.original.RedemptionLimitCount}</Badge>
            </Stack>
          </>
        )
      },
      {
        Header: "ACTIONS",
        Cell: ({row}) => (
          <ButtonGroup>
            <Button variant="outline" onClick={() => router.push(`/promotions/${row.original.ID}/`)}>
              Edit
            </Button>
            <Button variant="outline" onClick={() => deletePromotion(row.original.ID)}>
              Delete
            </Button>
          </ButtonGroup>
        )
      }
    ],
    [deletePromotion]
  )

  return <DataTable data={tableData} columns={columnsData} filters={filters} fetchData={fetchData} />
}

const ProtectedPromotionsList = () => {
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const cancelRef = useRef()
  const requestExportCSV = () => {}

  return (
    <ProtectedContent hasAccess={appPermissions.OrderManager}>
      <Box padding="GlobalPadding">
        <HStack justifyContent="space-between" w="100%" mb={5}>
          <Button onClick={() => router.push(`/promotions/add`)} variant="solid" colorScheme="primary">
            Create promotion
          </Button>

          <HStack>
            <ExportToCsv />
          </HStack>
        </HStack>
        <Card variant="primaryCard">
          <PromotionsList />
        </Card>
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedPromotionsList
