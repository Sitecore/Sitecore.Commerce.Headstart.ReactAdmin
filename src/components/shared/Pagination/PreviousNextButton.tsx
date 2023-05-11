import {useMemo} from "react"
import {Button, Icon} from "@chakra-ui/react"
import {GrFormNext, GrFormPrevious} from "react-icons/gr"

interface PreviousNextButtonProps {
  type: "previous" | "next"
  page: number
  isDisabled?: boolean
  onPageChange: (page: number) => void
}
export function PreviousNextButton({page, type, onPageChange, isDisabled}: PreviousNextButtonProps) {
  const newPage = useMemo(() => {
    return type === "next" ? page + 1 : page - 1
  }, [page, type])
  return (
    <Button variant="outline" isDisabled={isDisabled} onClick={() => onPageChange(newPage)}>
      <Icon as={type === "previous" ? GrFormPrevious : GrFormNext} w="16px" h="16px" color="gray.400" />
    </Button>
  )
}
