import {VStack, Text} from "@chakra-ui/react"
import {AsyncSelect} from "chakra-react-select"
import {Products, LineItems, Orders} from "ordercloud-javascript-sdk"
import {useCallback, useState} from "react"
import {ValueEditorProps} from "react-querybuilder"

const getModelName = (props: ValueEditorProps): string => {
  const modelParts = props.field.split(".")
  return modelParts[modelParts.length - 2]
}

export const hasSearchableIdField = (props: ValueEditorProps): boolean => {
  if (props.fieldData.label !== "ID") {
    return false
  }
  const modelName = getModelName(props)
  // These models live under another model (such as product, or buyer org). Not enough information to offer search
  const modelNamesWithoutSearchableId = ["Variant", "BillingAddress", "ShippingAddress"]
  return !modelNamesWithoutSearchableId.includes(modelName)
}

export const SearchableIdField = (props: ValueEditorProps) => {
  const modelName = getModelName(props)
  const [options, setOptions] = useState([])

  const loadOptions = useCallback(
    async (search: string) => {
      let _options = []
      switch (modelName) {
        case "Product":
          const productList = await Products.List({search})
          _options = productList.Items.map((item) => ({
            label: (
              <VStack gap={0} alignItems={"flex-start"}>
                <Text className="product-name-text">{item.Name}</Text>
                <Text className="product-id-text" fontSize="small" color="gray.400">
                  {item.ID}
                </Text>
              </VStack>
            ),
            value: item.ID
          }))
          break
        case "LineItem":
          const lineItemList = await LineItems.ListAcrossOrders("All", {search})
          _options = lineItemList.Items.map((item) => ({label: item.ID, value: item.ID}))
          break
        case "Order":
          const orderList = await Orders.List("All", {search})
          _options = orderList.Items.map((item) => ({label: item.ID, value: item.ID}))
          break
      }
      setOptions(_options)
      return _options
    },
    [modelName]
  )

  return (
    <AsyncSelect
      loadOptions={loadOptions}
      value={options.find((option) => option.value === props.value)}
      defaultOptions
      isMulti={false}
      onChange={(option) => props.handleOnChange(option.value)}
      chakraStyles={{
        container: (baseStyles) => ({...baseStyles, minWidth: "300px"}),
        singleValue: (baseStyles) => ({
          ...baseStyles,
          ".product-name-text": {display: "none"},
          ".product-id-text": {fontSize: "inherit", color: "inherit"}
        })
      }}
    />
  )
}
