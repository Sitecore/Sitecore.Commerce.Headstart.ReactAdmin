import React, {useEffect, useState} from "react"
import {Tree, ocNodeModel} from "@minoru/react-dnd-treeview"
import {CustomDragPreview} from "./CustomDragPreview"
import {CustomNode} from "./CustomNode"
import {DndProvider} from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend"
import {Placeholder} from "./Placeholder"
import styles from "./TreeView.module.css"

function TreeView(props) {
  const [treeData, setTreeData] = useState<ocNodeModel[]>([])
  useEffect(() => {
    setTreeData(props.treeData)
  }, [props.treeData])

  const handleDrop = (newTree: ocNodeModel[]) => setTreeData(newTree)

  return (
    <div className={styles.app}>
      <div className={styles.current}>
        <p>
          Current node:{" "}
          <span className={styles.currentLabel}>{props.selectedNode ? props.selectedNode.text : "none"}</span>
        </p>
      </div>

      <DndProvider backend={HTML5Backend}>
        <Tree
          tree={treeData}
          rootId={"-"}
          render={(node: ocNodeModel, {depth, isOpen, onToggle}) => (
            <CustomNode
              node={node}
              depth={depth}
              isOpen={isOpen}
              isSelected={node.id === props.selectedNode?.id}
              onToggle={onToggle}
              onSelect={props.handleSelect}
              onCategoryCreate={props.handleCategoryCreate}
            />
          )}
          dragPreviewRender={(monitorProps) => <CustomDragPreview monitorProps={monitorProps} />}
          onDrop={handleDrop}
          classes={{
            root: styles.treeRoot,
            draggingSource: styles.draggingSource,
            dropTarget: styles.dropTarget,
            placeholder: styles.placeholderContainer
          }}
          sort={false}
          insertDroppableFirst={false}
          canDrop={(tree, {dragSource, dropTargetId, dropTarget}) => {
            if (dragSource?.parent === dropTargetId) {
              return true
            }
          }}
          dropTargetOffset={10}
          placeholderRender={(node, {depth}) => <Placeholder depth={depth} />}
        />
      </DndProvider>
    </div>
  )
}

export default TreeView
