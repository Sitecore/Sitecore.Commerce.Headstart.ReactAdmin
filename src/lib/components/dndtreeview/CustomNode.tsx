import {NodeModel, ocNodeModel} from "@minoru/react-dnd-treeview"

import {ChevronRightIcon} from "@chakra-ui/icons"
import React from "react"
import {Button, Icon, Text} from "@chakra-ui/react"
import {TypeIcon} from "./TypeIcon"
import styles from "./CustomNode.module.css"
import {HiOutlinePlusCircle} from "react-icons/hi"
import {Category} from "ordercloud-javascript-sdk"

declare module "@minoru/react-dnd-treeview" {
  export interface ocNodeModel extends NodeModel<Category> {
    type: string
  }
}

type Props = {
  node: ocNodeModel
  depth: number
  isOpen: boolean
  isSelected: boolean
  onToggle: (id: ocNodeModel["id"]) => void
  onSelect: (node: ocNodeModel) => void
  onCategoryCreate: (category?: Category) => void
}

export const CustomNode: React.FC<Props> = (props) => {
  const {droppable, data} = props.node
  const indent = props.depth * 24

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    props.onToggle(props.node.id)
  }

  const handleSelect = () => props.onSelect(props.node)

  const categoryNode = (
    <div className={`tree-node ${styles.root}`} style={{paddingInlineStart: indent}} onClick={handleSelect}>
      <div className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ""}`}>
        {props.node.droppable && props.node.data.ChildCount > 0 && (
          <div onClick={handleToggle}>
            <ChevronRightIcon w={8} h={8} />
          </div>
        )}
      </div>
      <div>
        <TypeIcon droppable={droppable} type={props.node.type} />
      </div>
      <div className={styles.labelGridItem}>
        <span>{props.node.text}</span>
      </div>
      <Icon as={HiOutlinePlusCircle} fontSize="24px" onClick={() => props.onCategoryCreate(props.node.data)} />
    </div>
  )

  const createRootCategoryNode = (
    <Button marginTop={10} width="full" onClick={() => props.onCategoryCreate()}>
      Create root category
    </Button>
  )

  return props.node.type === "category" ? categoryNode : createRootCategoryNode
}
