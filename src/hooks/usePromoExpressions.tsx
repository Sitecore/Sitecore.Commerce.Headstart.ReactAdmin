import {useApiSpec} from "hooks/useApiSpec"
import {omit, startCase} from "lodash"
import {OpenAPIV3} from "openapi-types"
import {useCallback, useMemo} from "react"
import {Field} from "react-querybuilder"

type PromotionProperty = [string, OpenAPIV3.SchemaObject]

interface PromotionModels {
  // to be displayed in the UI
  label: string

  // path to property on OrderCloud model, used to build the promotion expression
  path: string

  properties: PromotionProperty[]
}

export function usePromoExpressions() {
  const {schemas} = useApiSpec()

  const buildPromoProperties = (properties: OpenAPIV3.SchemaObject, propertiesToExclude: string[]) => {
    const filteredProperties = omit(properties, [...propertiesToExclude, "xp"])
    return Object.entries(filteredProperties) as [string, OpenAPIV3.SchemaObject][]
  }

  const buildPromoModels = useCallback((schemas: Record<string, OpenAPIV3.SchemaObject>): PromotionModels[] => {
    return [
      {
        label: "Product",
        path: "LineItem.Product",
        properties: buildPromoProperties(schemas.LineItemProduct.properties, [])
      },
      {
        label: "Line Item",
        path: "LineItem",
        properties: buildPromoProperties(schemas.LineItem.properties, [
          "ShippingAddressID",
          "Product",
          "ShippingAddress"
        ])
      },
      {
        label: "Variant",
        path: "LineItem.Variant",
        properties: buildPromoProperties(schemas.Variant.properties, [])
      },
      {
        label: "User",
        path: "Order.FromUser",
        properties: buildPromoProperties(schemas.User.properties, ["Password", "Active", "AvailableRoles"])
      },
      {
        label: "Order",
        path: "Order",
        properties: buildPromoProperties(schemas.Order.properties, [
          "FromUser",
          "FromUserID",
          "BillingAddress",
          "ShippingAddressID",
          "Comments"
        ])
      },
      {
        label: "Billing Address",
        path: "Order.BillingAddress",
        properties: buildPromoProperties(schemas.Address.properties, [])
      },
      {
        label: "Shipping Address",
        path: "LineItem.ShippingAddress",
        properties: buildPromoProperties(schemas.Address.properties, [])
      },
      {
        label: "Value",
        path: "",
        properties: [
          ["text", {type: "string"}],
          ["boolean", {type: "boolean"}],
          ["number", {type: "number"}],
          ["date", {type: "string", format: "date-time"}]
        ]
      }
    ]
  }, [])

  const result = useMemo(() => {
    if (schemas) {
      const models = buildPromoModels(schemas)
      const fields = Object.values(models)
        .map((model) => {
          return model.properties.map(([name, property]) => {
            return {
              name: `${model.path}.${name}`,
              label: startCase(name),
              type: property.type,
              inputType:
                property.format === "date-time" ? "datetime-local" : property.type === "number" ? "number" : "text",
              valueEditorType: property.type === "boolean" ? "checkbox" : "text",
              modelPath: model.path
            } as Field
          })
        })
        .flat()

      const options = Object.values(models).map((model) => ({
        value: model.path,
        label: startCase(model.label)
      }))

      return {
        models,
        fields,
        options
      }
    }
    return {
      models: null,
      fields: null,
      options: null
    }
  }, [schemas, buildPromoModels])

  return result
}
