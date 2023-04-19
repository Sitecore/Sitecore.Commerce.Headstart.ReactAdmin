import {Box, Button, ButtonGroup, HStack} from "@chakra-ui/react"
import {ListPage, SupplierUserGroups, UserGroup} from "ordercloud-javascript-sdk"
import {OrderCloudTableColumn, OrderCloudTableFilters} from "components/ordercloud-table"
import {useCallback, useEffect, useMemo, useState} from "react"

import Card from "components/card/Card"
import {DataTable} from "components/data-table/DataTable"
import ExportToCsv from "components/demo/ExportToCsv"
import {ISupplier} from "types/ordercloud/ISupplier"
import {Link} from "components/navigation/Link"
import React from "react"
import {useRouter} from "hooks/useRouter"
import {useSuccessToast} from "hooks/useToast"
import SupplierUserGroupList from "@/components/supplierusergroups/list/SupplierUserGroupList"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "User groups List",
        metas: {
          hasBreadcrumbs: true,
          hasSupplierContextSwitch: true
        }
      },
      revalidate: 5 * 60
    }
  }
}

const UserGroupsList = () => {
  const router = useRouter()
  const supplierID = router.query.supplierid as string

  return (
    <>
      <Box padding="GlobalPadding">
        <SupplierUserGroupList supplierid={supplierID}></SupplierUserGroupList>
      </Box>
    </>
  )
}

export default UserGroupsList
