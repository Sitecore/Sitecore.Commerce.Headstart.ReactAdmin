import {PromoRecipeVariable} from "./PromotionRecipesSelect"

type TransformFunction = (variable: PromoRecipeVariable, allVariables: PromoRecipeVariable[]) => any

export const transformFunctions: Record<string, TransformFunction> = {
  divideBy100: (variable) => variable.value / 100,
  bundleEligibleExpression: (variable, allVariables) => {
    const buyProductId = allVariables.find((v) => v.token === "BUY_PRODUCT")?.value
    const buyProductQuantity = parseInt(allVariables.find((v) => v.token === "BUY_PRODUCT_QUANTITY")?.value)
    const getProductId = allVariables.find((v) => v.token === "GET_PRODUCT")?.value
    const getProductQuantity = parseInt(allVariables.find((v) => v.token === "GET_PRODUCT_QUANTITY")?.value)
    const sameSkuTemplate = {
      rules: [
        {
          id: "1",
          rules: [
            {
              id: "2",
              field: "LineItem.Product.ID",
              operator: "=",
              valueSource: "value",
              value: buyProductId,
              modelPath: "LineItem.Product",
              modelName: "Product"
            }
          ],
          not: false,
          operator: "items.quantity"
        },
        ">=",
        {
          id: "3",
          field: ".number",
          operator: "=",
          valueSource: "value",
          value: buyProductQuantity + getProductQuantity,
          modelPath: "",
          modelName: "Value"
        }
      ],
      id: "root"
    }

    const differentSkuTemplate = {
      rules: [
        {
          id: "1",
          rules: [
            {
              id: "2",
              rules: [
                {
                  id: "3",
                  field: "LineItem.Product.ID",
                  operator: "=",
                  valueSource: "value",
                  value: buyProductId,
                  modelPath: "LineItem.Product",
                  modelName: "Product"
                }
              ],
              not: false,
              operator: "items.quantity"
            },
            ">=",
            {
              id: "4",
              field: ".number",
              operator: "=",
              valueSource: "value",
              value: buyProductQuantity,
              modelPath: "",
              modelName: "Value"
            }
          ],
          not: false
        },
        "and",
        {
          id: "5",
          rules: [
            {
              id: "6",
              rules: [
                {
                  id: "7",
                  field: "LineItem.Product.ID",
                  operator: "=",
                  valueSource: "value",
                  value: getProductId,
                  modelPath: "LineItem.Product",
                  modelName: "Product"
                }
              ],
              not: false,
              operator: "items.quantity"
            },
            ">=",
            {
              id: "8",
              field: ".number",
              operator: "=",
              valueSource: "value",
              value: getProductQuantity,
              modelPath: "",
              modelName: "Value"
            }
          ],
          not: false,
          operator: ""
        }
      ],
      id: "root"
    }

    return JSON.stringify(buyProductId === getProductId ? sameSkuTemplate : differentSkuTemplate)
  },
  bundleCategoryEligibleExpression: (variable, allVariables) => {
    const buyCategoryId = allVariables.find((v) => v.token === "BUY_CATEGORY")?.value
    const buyCatalogId = allVariables.find((v) => v.token === "BUY_CATEGORY__PARENT")?.value
    const buyProductQuantity = parseInt(allVariables.find((v) => v.token === "BUY_PRODUCT_QUANTITY")?.value)
    const getCategoryId = allVariables.find((v) => v.token === "GET_CATEGORY")?.value
    const getCatalogId = allVariables.find((v) => v.token === "GET_CATEGORY__PARENT")?.value
    const getProductQuantity = parseInt(allVariables.find((v) => v.token === "GET_PRODUCT_QUANTITY")?.value)
    const sameSkuTemplate = {
      rules: [
        {
          id: "1",
          rules: [
            {
              id: "2",
              field: "LineItem.Product.Category",
              operator: "=",
              valueSource: "value",
              value: buyCategoryId,
              parentValue: buyCatalogId,
              modelPath: "LineItem.Product",
              modelName: "Product"
            }
          ],
          not: false,
          operator: "items.quantity"
        },
        ">=",
        {
          id: buyProductQuantity,
          field: ".number",
          operator: "=",
          valueSource: "value",
          value: 2,
          modelPath: "",
          modelName: "Value"
        }
      ],
      id: "root"
    }

    const differentSkuTemplate = {
      rules: [
        {
          id: "1",
          rules: [
            {
              id: "2",
              rules: [
                {
                  id: "3",
                  field: "LineItem.Product.Category",
                  operator: "=",
                  valueSource: "value",
                  value: buyCategoryId,
                  parentValue: buyCatalogId,
                  modelPath: "LineItem.Product",
                  modelName: "Product"
                }
              ],
              not: false,
              operator: "items.quantity"
            },
            ">=",
            {
              id: "4",
              field: ".number",
              operator: "=",
              valueSource: "value",
              value: buyProductQuantity,
              modelPath: "",
              modelName: "Value"
            }
          ],
          not: false
        },
        "and",
        {
          id: "5",
          rules: [
            {
              id: "6",
              rules: [
                {
                  id: "7",
                  field: "LineItem.Product.Category",
                  operator: "=",
                  valueSource: "value",
                  value: getCategoryId,
                  parentValue: getCatalogId,
                  modelPath: "LineItem.Product",
                  modelName: "Product"
                }
              ],
              not: false,
              operator: "items.quantity"
            },
            ">=",
            {
              id: "8",
              field: ".number",
              operator: "=",
              valueSource: "value",
              value: getProductQuantity,
              modelPath: "",
              modelName: "Value"
            }
          ],
          not: false,
          operator: ""
        }
      ],
      id: "root"
    }

    return JSON.stringify(buyCategoryId === getCategoryId ? sameSkuTemplate : differentSkuTemplate)
  }
}
