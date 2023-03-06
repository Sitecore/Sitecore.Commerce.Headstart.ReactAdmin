import {NodeModel} from "@minoru/react-dnd-treeview"
import React from "react"
import {TypeIcon} from "./TypeIcon"
import styles from "./CustomDragPreview.module.css"

type Props = {
  monitorProps: any
}

export const CustomDragPreview: React.FC<Props> = (props) => {
  const item = props.monitorProps.item

  return (
    <div className={styles.root}>
      <div className={styles.icon}>
        <TypeIcon droppable={item.droppable} type={item?.type} />
      </div>
      <div className={styles.label}>{item.text}</div>
    </div>
  )
}
