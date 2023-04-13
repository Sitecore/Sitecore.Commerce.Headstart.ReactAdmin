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
import PromotionCard from "./PromotionCard"
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
  cell: ({row, value}) => (
    <Link passHref href={"/promotions/" + value}>
      <Text as="a" noOfLines={2} wordBreak="break-all" title={value}>
        {value}
      </Text>
    </Link>
  ),
  sortable: true
}
const NameColumn: DataTableColumn<IPromotion> = {
  header: "Name",
  accessor: "Name",
  width: "15%",
  cell: ({row, value}) => (
    <Link passHref href={"/promotions/" + row.original.ID}>
      <Text as="a" noOfLines={2} title={value}>
        {value}
      </Text>
    </Link>
  ),
  sortable: true
}
const DescriptionColumn: DataTableColumn<IPromotion> = {
  header: "Description",
  accessor: "Description",
  width: "15%",
  cell: ({row, value}) => (
    <Link passHref href={"/promotions/" + row.original.ID}>
      <Text as="a" noOfLines={3} fontSize="sm" title={value}>
        {value || "N/A"}
      </Text>
    </Link>
  ),
  sortable: true
}

const CodeColumn: DataTableColumn<IPromotion> = {
  header: "Code",
  accessor: "Code",
  width: "15%",
  cell: ({row, value}) => (
    <Link passHref href={"/promotions/" + row.original.ID}>
      <Code as="a" title={value}>
        {value}
      </Code>
    </Link>
  ),
  sortable: true
}

const LineItemLevelColumn: DataTableColumn<IPromotion> = {
  header: "Level",
  accessor: "LineItemLevel",
  width: "1%",
  align: "center",
  cell: ({row, value}) => (
    <Link passHref href={"/promotions/" + row.original.ID}>
      <Tag colorScheme={value ? "info" : "primary"}>{value ? "LineItem" : "Order"}</Tag>
    </Link>
  )
}

const StartDateColumn: DataTableColumn<IPromotion> = {
  header: "Start Date",
  accessor: "StartDate",
  cell: ({row, value}) => (
    <Link passHref href={`/promoitons/${row.original.ID}`}>
      <Text as="a">{dateHelper.formatDate(value)}</Text>
    </Link>
  ),
  sortable: true
}
const ExpirationDateColumn: DataTableColumn<IPromotion> = {
  header: "Expiration Date",
  accessor: "ExpirationDate",
  cell: ({row, value}) => (
    <Link passHref href={`/promoitons/${row.original.ID}`}>
      <Text as="a">{value ? dateHelper.formatDate(value) : "N/A"}</Text>
    </Link>
  ),
  sortable: true
}

const StatusColumn: DataTableColumn<IPromotion> = {
  header: "Status",
  accessor: "Active",
  width: "1%",
  align: "center",
  cell: ({row, value}) => <Tag colorScheme={value ? "success" : "danger"}>{value ? "Active" : "Inactive"}</Tag>,
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

const PromotionGridOptions: ListViewGridOptions<IPromotion> = {
  renderGridItem: (promotion, index, renderActions, selected, onSelectChange) => (
    <PromotionCard
      key={index}
      promotion={promotion}
      selected={selected}
      renderPromotionActions={renderActions}
      onPromotionSelected={onSelectChange}
    />
  )
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

  return (
    <ListView<IPromotion>
      service={Promotions.List}
      queryMap={PromotionQueryMap}
      filterMap={PromotionFilterMap}
      itemActions={renderPromotionActionsMenu}
      tableOptions={PromotionTableOptions}
      gridOptions={PromotionGridOptions}
    >
      {({renderContent, items, ...listViewChildProps}) => (
        <Container maxW="100%">
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
