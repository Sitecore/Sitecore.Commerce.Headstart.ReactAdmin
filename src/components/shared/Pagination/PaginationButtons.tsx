import {Button, ButtonGroup, Text} from "@chakra-ui/react"

interface PaginationButtonsProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}
export function PaginationButtons({page, totalPages, onPageChange}: PaginationButtonsProps) {
  const buildPagesArray = (count) => {
    // ex: count 3 returns [1, 2, 3]
    return Array(count)
      .fill(null)
      .map((value, index) => index + 1)
  }

  return (
    <ButtonGroup isAttached>
      {buildPagesArray(totalPages).map((pageNumber) => {
        return (
          <Button
            variant="outline"
            onClick={() => onPageChange(pageNumber)}
            isActive={pageNumber === page}
            key={pageNumber}
          >
            {pageNumber}
          </Button>
        )
      })}
    </ButtonGroup>
  )
}
