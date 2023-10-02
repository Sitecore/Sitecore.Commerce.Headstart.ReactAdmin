import {IconButton} from "@chakra-ui/react"
import {MdDeleteOutline} from "react-icons/md"
import {ActionProps} from "react-querybuilder"

export function CustomRemoveGroupAction({handleOnClick, disabled}: ActionProps) {
  return (
    <IconButton
      aria-label="Delete"
      title="Delete"
      isDisabled={disabled}
      onClick={handleOnClick}
      icon={<MdDeleteOutline />}
    />
  )
}
