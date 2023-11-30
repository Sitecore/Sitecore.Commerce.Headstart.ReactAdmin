import {ReactNode} from "react"

export interface ReactSelectOption {
  value: string
  label: ReactNode
}

export interface GroupedReactSelectOption {
  label: string
  options: ReactSelectOption[]
}
