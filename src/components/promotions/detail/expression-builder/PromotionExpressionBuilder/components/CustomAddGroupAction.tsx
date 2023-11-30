import {Button} from "@chakra-ui/react"
import {MdAdd} from "react-icons/md"
import {ActionWithRulesAndAddersProps} from "react-querybuilder"

export function CustomAddGroupAction({handleOnClick, context}: ActionWithRulesAndAddersProps) {
  return (
    <Button leftIcon={<MdAdd />} onClick={handleOnClick} isDisabled={context?.isDisabled}>
      Group
    </Button>
  )
}
