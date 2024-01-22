import {update, ValueEditorProps} from "react-querybuilder"
import {SearchableInput} from "./SearchableInput"
import {IProduct} from "types/ordercloud/IProduct"
import {useCallback} from "react"
import {ICatalog} from "types/ordercloud/ICatalog"
import {IOrder} from "types/ordercloud/IOrder"
import {IBuyer} from "types/ordercloud/IBuyer"
import {Address, User} from "ordercloud-javascript-sdk"
import {ILineItem} from "types/ordercloud/ILineItem"
import {HStack, Text, VStack} from "@chakra-ui/react"

export const getModelName = (props: ValueEditorProps): string => {
  const modelParts = props.field.split(".")
  return modelParts[modelParts.length - 2]
}

export const hasSearchableField = (props: ValueEditorProps): boolean => {
  const modelName = getModelName(props)
  if (modelName === "Variant") {
    // too weird to handle, and not very useful anyway
    return false
  }
  return props.field.endsWith(".ID") || props.field === "LineItem.Product.Category"
}

interface SearchableFieldProps extends ValueEditorProps {
  showInModal?: boolean
  handleOnParentChange?: (value: string) => void
}
export const SearchableField = (props: SearchableFieldProps) => {
  const modelName = getModelName(props)

  const formatDisplayIdLabel = useCallback((display: string, id: string) => {
    return (
      <>
        {/* multiline will show when select is open */}
        <VStack className="multi-line" alignItems="flex-start">
          <Text>{display}</Text>
          <Text color="gray.400" fontSize="sm">
            {id}
          </Text>
        </VStack>
        {/* single line will show when selected */}
        <HStack className="single-line" fontSize="sm">
          <Text>{display}</Text>
          <Text>|</Text>
          <Text color="gray.400">{id}</Text>
        </HStack>
      </>
    )
  }, [])

  const formatCategoryOptions = useCallback((category: any) => {
    return {
      value: category.ID,
      label: `${category.Name} | ${category.ID}`
    }
  }, [])

  const formatProductOptions = useCallback(
    (product: IProduct) => ({
      value: product.ID,
      label: formatDisplayIdLabel(product.Name, product.ID)
    }),
    [formatDisplayIdLabel]
  )

  const formatCatalogOptions = useCallback(
    (catalog: ICatalog) => ({value: catalog.ID, label: formatDisplayIdLabel(catalog.Name, catalog.ID)}),
    [formatDisplayIdLabel]
  )
  const formatOrderOptions = useCallback((order: IOrder) => ({value: order.ID, label: order.ID}), [])
  const formatBuyerOptions = useCallback(
    (buyer: IBuyer) => ({value: buyer.ID, label: formatDisplayIdLabel(buyer.Name, buyer.ID)}),
    [formatDisplayIdLabel]
  )
  const formatAddressOptions = useCallback(
    (address: Address) => ({value: address.ID, label: `${address.AddressName} | ${address.ID}`}),
    []
  )
  const formatUserOptions = useCallback(
    (user: User) => ({
      value: user.ID,
      label: `${user.FirstName} | ${user.ID}`
    }),
    []
  )
  const formatLineItemOptions = useCallback((lineItem: ILineItem) => ({value: lineItem.ID, label: lineItem.ID}), [])

  const handleChange = (value: string, parentValue: string) => {
    if (props.showInModal) {
      props.handleOnChange(value)
      if (parentValue) {
        props.handleOnParentChange(parentValue)
      }
    } else {
      props.handleOnChange(value)
      if (parentValue) {
        let updatedQuery = update(props.context.query, "parentValue" as any, parentValue, props.path)
        updatedQuery = update(updatedQuery, "value" as any, value, props.path)
        props.context.setQuery(updatedQuery)
      }
    }
  }

  if (props.field === "LineItem.Product.Category") {
    return (
      <SearchableInput
        showInModal={props.showInModal}
        resource="Categories"
        onUpdate={handleChange}
        value={props.value}
        parentValue={(props.rule as any)?.parentValue || ""}
        formatResourceOptions={formatCategoryOptions}
        parentResource="Catalogs"
        formatParentResourceOptions={formatCatalogOptions}
        isDisabled={props.context?.isDisabled}
      />
    )
  }
  switch (modelName) {
    case "Product":
      return (
        <SearchableInput
          showInModal={props.showInModal}
          resource="Products"
          onUpdate={handleChange}
          value={props.value}
          parentValue={(props.rule as any)?.parentValue || ""}
          formatResourceOptions={formatProductOptions}
          isDisabled={props.context?.isDisabled}
        />
      )
    case "LineItem":
      return (
        <SearchableInput
          showInModal={props.showInModal}
          resource="LineItems"
          onUpdate={handleChange}
          value={props.value}
          parentValue={(props.rule as any)?.parentValue || ""}
          formatResourceOptions={formatLineItemOptions}
          params={["All"]}
          parentResource="Orders"
          formatParentResourceOptions={formatOrderOptions}
          isDisabled={props.context?.isDisabled}
        />
      )
    case "FromUser":
      return (
        <SearchableInput
          showInModal={props.showInModal}
          resource="Users"
          onUpdate={handleChange}
          value={props.value}
          parentValue={(props.rule as any)?.parentValue || ""}
          formatResourceOptions={formatUserOptions}
          parentResource="Buyers"
          formatParentResourceOptions={formatBuyerOptions}
          isDisabled={props.context?.isDisabled}
        />
      )
    case "Order":
      return (
        <SearchableInput
          showInModal={props.showInModal}
          resource="Orders"
          onUpdate={handleChange}
          value={props.value}
          parentValue={(props.rule as any)?.parentValue || ""}
          formatResourceOptions={formatOrderOptions}
          params={["All"]}
          isDisabled={props.context?.isDisabled}
        />
      )
    case "BillingAddress":
      return (
        <SearchableInput
          showInModal={props.showInModal}
          resource="Addresses"
          onUpdate={handleChange}
          value={props.value}
          parentValue={(props.rule as any)?.parentValue || ""}
          formatResourceOptions={formatAddressOptions}
          parentResource="Buyers"
          formatParentResourceOptions={formatBuyerOptions}
          isDisabled={props.context?.isDisabled}
        />
      )
    case "ShippingAddress":
      return (
        <SearchableInput
          showInModal={props.showInModal}
          resource="Addresses"
          onUpdate={handleChange}
          value={props.value}
          parentValue={(props.rule as any)?.parentValue || ""}
          formatResourceOptions={formatAddressOptions}
          parentResource="Buyers"
          formatParentResourceOptions={formatBuyerOptions}
          isDisabled={props.context?.isDisabled}
        />
      )
    default:
      throw new Error(`No searchable id field for model ${modelName}`)
  }
}
