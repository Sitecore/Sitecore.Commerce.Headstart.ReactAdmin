import type {Field, RuleType} from "react-querybuilder"

import {defaultOperators} from "react-querybuilder"

export const validator = (r: RuleType) => !!r.value

export const fields: Field[] = [
  {
    name: "ProductName",
    label: "Product Name",
    placeholder: "Enter product name",
    defaultOperator: "beginsWith",
    validator
  },
  {
    name: "ProductId",
    label: "Product ID",
    placeholder: "Enter product id",
    validator
  },
  {
    name: "CategoryName",
    label: "Category Name",
    placeholder: "Enter category name",
    defaultOperator: "beginsWith",
    validator
  },
  {
    name: "CategoryId",
    label: "Category ID",
    placeholder: "Enter category id",
    validator
  },
  {
    name: "Quantity",
    label: "Quantity",
    placeholder: "Enter quantity",
    validator
  },
  {
    name: "TotalOrderAmount",
    label: "Total Order Amount",
    placeholder: "Enter amount",
    validator
  }
]
