import * as ReactDnD from "react-dnd"
import * as ReactDndHtml5Backend from "react-dnd-html5-backend"

import {chakra, ChakraProvider, extendTheme} from "@chakra-ui/react"

import {QueryBuilder} from "react-querybuilder"
import {QueryBuilderChakra} from "@react-querybuilder/chakra"
import {QueryBuilderDnD} from "@react-querybuilder/dnd"
import type {RuleGroupType} from "react-querybuilder"
import {fields} from "./fileds"
import {useState} from "react"
import schraTheme from "theme/theme"

const ChakraQueryBuilderDnD = chakra(QueryBuilderDnD)

const initialQuery: RuleGroupType = {combinator: "and", rules: []}

export const ExpressionBuilder = () => {
  const [query, setQuery] = useState(initialQuery)

  return (
    <ChakraQueryBuilderDnD dnd={{...ReactDnD, ...ReactDndHtml5Backend}}>
      <ChakraProvider theme={schraTheme}>
        <QueryBuilderChakra>
          <QueryBuilder
            fields={fields}
            query={query}
            onQueryChange={(q) => setQuery(q)}
            addRuleToNewGroups
            showCombinatorsBetweenRules
          />
        </QueryBuilderChakra>
      </ChakraProvider>
    </ChakraQueryBuilderDnD>
  )
}
