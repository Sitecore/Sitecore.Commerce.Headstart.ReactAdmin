import {IconButton} from "@chakra-ui/react"
import {MdDeleteOutline} from "react-icons/md"
import {ActionProps} from "react-querybuilder"

export function CustomRemoveGroupAction({handleOnClick, disabled, context}: ActionProps) {
  return (
    <IconButton
      aria-label="Delete"
      title="Delete"
      isDisabled={disabled || context?.isDisabled}
      onClick={handleOnClick}
      icon={<MdDeleteOutline />}
    />
  )
}
