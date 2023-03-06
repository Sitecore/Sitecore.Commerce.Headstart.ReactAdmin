import {MdDomain, MdGroup, MdLibraryBooks, MdPerson, MdStorefront} from "react-icons/md"

import {Icon} from "@chakra-ui/react"
import React from "react"

type Props = {
  droppable: boolean
  type?: any
}

// The dnd-tree-view is used mainly to render categories hierarchy.
// TODO: In the mear future I will use it be able to provide the business user a way to explore the commerce byers organization with a tree view of buyers > Users groups > Users.
export const TypeIcon: React.FC<Props> = (props) => {
  switch (props.type) {
    case "buyer":
      return <Icon as={MdDomain} />
    case "usergroup":
      return <Icon as={MdGroup} />
    case "user":
      return <Icon as={MdPerson} />
    case "catalog":
      return <Icon as={MdStorefront} />
    case "category":
      return
    default:
      return
  }
}
