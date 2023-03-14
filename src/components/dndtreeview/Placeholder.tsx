import React from "react"
import styles from "./Placeholder.module.css"

type Props = {
  depth: number
}

export const Placeholder: React.FC<Props> = (props) => {
  const left = props.depth * 24

  return <div className={styles.root} style={{left}}></div>
}
