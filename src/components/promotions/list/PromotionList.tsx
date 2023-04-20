import {Box, Code, Container, Tag, Text, useDisclosure} from "@chakra-ui/react"
import Link from "next/link"
import {Promotions} from "ordercloud-javascript-sdk"
import {useCallback, useState} from "react"
import {IPromotion} from "types/ordercloud/IPromotion"
import {dateHelper} from "utils"
import {DataTableColumn} from "../../shared/DataTable/DataTable"
import ListView, {ListViewGridOptions, ListViewTableOptions} from "../../shared/ListView/ListView"
import PromotionDeleteModal from "../modals/PromotionDeleteModal"
import PromotionActionMenu from "./PromotionActionMenu"
import PromotionListToolbar from "./PromotionListToolbar"

const PromotionQueryMap = {
  s: "Search",
  sort: "SortBy",
  p: "Page"
}

const PromotionFilterMap = {
  active: "Active"
}

const IdColumn: DataTableColumn<IPromotion> = {
  header: "ID",
  accessor: "ID",
  width: "10%",
  cell: ({value}) => (
    <Text noOfLines={2} wordBreak="break-all" title={value}>
      {value}
    </Text>
  ),
  sortable: true
}
const NameColumn: DataTableColumn<IPromotion> = {
  header: "Name",
  accessor: "Name",
  width: "15%",
  cell: ({value}) => (
    <Text noOfLines={2} title={value}>
      {value}
    </Text>
  ),
  sortable: true
}
const DescriptionColumn: DataTableColumn<IPromotion> = {
  header: "Description",
  accessor: "Description",
  width: "15%",
  cell: ({value}) => (
    <Text noOfLines={3} fontSize="sm" title={value}>
      {value || "N/A"}
    </Text>
  ),
  sortable: true
}

const CodeColumn: DataTableColumn<IPromotion> = {
  header: "Code",
  accessor: "Code",
  width: "15%",
  cell: ({value}) => <Code title={value}>{value}</Code>,
  sortable: true
}

const LineItemLevelColumn: DataTableColumn<IPromotion> = {
  header: "Level",
  accessor: "LineItemLevel",
  width: "1%",
  align: "center",
  cell: ({value}) => <Tag colorScheme={value ? "info" : "primary"}>{value ? "LineItem" : "Order"}</Tag>
}

const StartDateColumn: DataTableColumn<IPromotion> = {
  header: "Start Date",
  accessor: "StartDate",
  width: "15%",
  cell: ({value}) => <Text fontSize="sm">{dateHelper.formatDate(value)}</Text>,
  sortable: true
}
const ExpirationDateColumn: DataTableColumn<IPromotion> = {
  header: "Expiration Date",
  accessor: "ExpirationDate",
  width: "15%",
  cell: ({value}) => <Text fontSize="sm">{value ? dateHelper.formatDate(value) : "N/A"}</Text>,
  sortable: true
}

const StatusColumn: DataTableColumn<IPromotion> = {
  header: "Status",
  accessor: "Active",
  width: "1%",
  align: "center",
  cell: ({value}) => <Tag colorScheme={value ? "success" : "danger"}>{value ? "Active" : "Inactive"}</Tag>,
  sortable: true
}

const PromotionTableOptions: ListViewTableOptions<IPromotion> = {
  responsive: {
    base: [IdColumn, NameColumn, StatusColumn],
    md: [IdColumn, NameColumn, StatusColumn],
    lg: [IdColumn, NameColumn, DescriptionColumn, CodeColumn, StatusColumn],
    xl: [IdColumn, NameColumn, DescriptionColumn, CodeColumn, LineItemLevelColumn, StatusColumn],
    "2xl": [
      IdColumn,
      NameColumn,
      DescriptionColumn,
      CodeColumn,
      LineItemLevelColumn,
      StartDateColumn,
      ExpirationDateColumn,
      StatusColumn
    ]
  }
}

const PromotionList = () => {
  const [actionPromotion, setActionPromotion] = useState<IPromotion>()
  const deleteDisclosure = useDisclosure()

  const renderPromotionActionsMenu = useCallback(
    (promotion: IPromotion) => {
      return (
        <PromotionActionMenu
          promotion={promotion}
          onOpen={() => setActionPromotion(promotion)}
          onDelete={deleteDisclosure.onOpen}
        />
      )
    },
    [deleteDisclosure.onOpen]
  )

  const resolvePromotionDetailHref = (promotion: IPromotion) => {
    return `/promotions/${promotion.ID}`
  }

  return (
    <ListView<IPromotion>
      service={Promotions.List}
      queryMap={PromotionQueryMap}
      filterMap={PromotionFilterMap}
      itemHrefResolver={resolvePromotionDetailHref}
      itemActions={renderPromotionActionsMenu}
      tableOptions={PromotionTableOptions}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
          <Box>
            <PromotionListToolbar {...listViewChildProps} />
          </Box>
          {renderContent}
          <PromotionDeleteModal
            onComplete={listViewChildProps.removeItems}
            promotions={
              actionPromotion
                ? [actionPromotion]
                : items
                ? items.filter((promotion) => listViewChildProps.selected.includes(promotion.ID))
                : []
            }
            disclosure={deleteDisclosure}
          />
        </Container>
      )}
    </ListView>
  )
}

export default PromotionList
