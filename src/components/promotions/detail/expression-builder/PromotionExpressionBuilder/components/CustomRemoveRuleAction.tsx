import {IconButton} from "@chakra-ui/react"
import {MdDeleteOutline} from "react-icons/md"
import {ActionProps} from "react-querybuilder"

export function CustomRemoveRuleAction({handleOnClick, disabled, context}: ActionProps) {
  return (
    <IconButton
      aria-label="Delete"
      colorScheme="danger"
      variant="ghost"
      title="Delete"
      isDisabled={disabled || context?.isDisabled}
      onClick={handleOnClick}
      icon={<MdDeleteOutline fontSize="1.35em" />}
    />
  )
}
