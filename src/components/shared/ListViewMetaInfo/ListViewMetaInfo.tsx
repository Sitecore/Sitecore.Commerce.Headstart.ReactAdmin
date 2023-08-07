import {FC} from "react"
import {Text} from "@chakra-ui/react"

interface IListViewMetaInfo {
  range: number[]
  total: number
}

const ListViewMetaInfo: FC<IListViewMetaInfo> = ({range, total}) => {
  return (
    <Text
      alignSelf="center"
      flexShrink={0}
      fontSize="sm"
      fontWeight="semibold"
      size="sm"
    >{`${range[0]} - ${range[1]} of ${total}`}</Text>
  )
}

export default ListViewMetaInfo
