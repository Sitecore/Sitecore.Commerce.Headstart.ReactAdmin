import {Button, Icon} from "@chakra-ui/react"
import {GrFormNext, GrFormPrevious} from "react-icons/gr"

interface PreviousNextButtonProps {
  type: "previous" | "next"
  page: number
  onPageChange: (page: number) => void
}
export function PreviousNextButton({page, type, onPageChange}: PreviousNextButtonProps) {
  return (
    <Button
      variant="no-effects"
      onClick={() => onPageChange(page + 1)}
      transition="all .5s ease"
      w="40px"
      h="40px"
      borderRadius="8px"
      bg="#fff"
      border="1px solid lightgray"
      display="flex"
      _hover={{
        bg: "gray.200",
        opacity: "0.7",
        borderColor: "gray.500"
      }}
    >
      <Icon as={type === "previous" ? GrFormPrevious : GrFormNext} w="16px" h="16px" color="gray.400" />
    </Button>
  )
}
