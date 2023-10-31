import {Operator} from "react-querybuilder"

export const operators: Operator<OperatorName>[] = [
  {name: "=", label: "Equal to", appliesTo: ["number", "date", "string"], group: "Comparison"},
  {name: "<", label: "Less than", appliesTo: ["number", "date"], group: "Comparison"},
  {name: ">", label: "Greater than", appliesTo: ["number", "date"], group: "Comparison"},
  {name: "<=", label: "Less than or equal to", appliesTo: ["number"], group: "Comparison"},
  {name: ">=", label: "Greater than or equal to", appliesTo: ["number"], group: "Comparison"},
  {name: "not", label: "Not Equal to", appliesTo: ["number", , "string"], group: "Comparison"},
  {name: "+", label: "Add", appliesTo: ["number"], group: "Mathematical"},
  {name: "-", label: "Subtract", appliesTo: ["number"], group: "Mathematical"},
  {name: "*", label: "Multiply", appliesTo: ["number"], group: "Mathematical"},
  {name: "/", label: "Divide", appliesTo: ["number"], group: "Mathematical"},
  {name: "%", label: "Modulo", appliesTo: ["number"], group: "Mathematical"},
  {name: "containsText", label: "Contains Text", appliesTo: ["array"], group: "Array"},
  {name: "containsNumber", label: "Contains number", appliesTo: ["array"], group: "Array"},
  {name: "count", label: "Count", appliesTo: ["array"], group: "Array", arity: "unary"},
  {name: "countWithCriteria", label: "Count with criteria", appliesTo: ["array"], group: "Array"},
  {name: "any", label: "Any", appliesTo: ["array"], group: "Array"},
  {name: "all", label: "All", appliesTo: ["array"], group: "Array"},
  {name: "value", label: "Value", appliesTo: ["number", "date", "string"], arity: "unary", group: "Miscellaneous"},
  {name: "in", label: "In", appliesTo: ["string"], group: "Miscellaneous"}
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
  "value",
  "containsText",
  "containsNumber",
  "count",
  "countWithCriteria",
  "any",
  "all",
  "in"
] as const
export type OperatorName = (typeof operatorNames)[number]
