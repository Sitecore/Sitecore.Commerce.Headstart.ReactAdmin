import {Operator} from "react-querybuilder"

export const operators: Operator<OperatorName>[] = [
  {name: "=", label: "Equal to", category: ["number", "date", "string"]},
  {name: "<", label: "Less than", category: ["number", "date"]},
  {name: ">", label: "Greater than", category: ["number", "date"]},
  {name: "<=", label: "Less than or equal to", category: ["number"]},
  {name: ">=", label: "Greater than or equal to", category: ["number"]},
  {name: "not", label: "Not Equal to", category: ["number", , "string"]},
  {name: "+", label: "Add", category: ["number"]},
  {name: "-", label: "Subtract", category: ["number"]},
  {name: "*", label: "Multiply", category: ["number"]},
  {name: "/", label: "Divide", category: ["number"]},
  {name: "%", label: "Modulo", category: ["number"]},
  {name: "value", label: "Value", category: ["number", "date", "string"], arity: "unary"}
]

export const operatorNames = [
  "=",
  "<",
  ">",
  "<=",
  ">=",
  "not",
  "+",
  "-",
  "*",
  "/",
  "%",
  "arrayContains",
  "arrayCount",
  "arrayAny",
  "arrayAll",
  "in",
  "value"
] as const
export type OperatorName = (typeof operatorNames)[number]
