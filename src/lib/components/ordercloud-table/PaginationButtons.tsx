import {Button, Text} from "@chakra-ui/react"

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
    <>
      {buildPagesArray(totalPages).map((pageNumber) => {
        return (
          <Button
            variant="no-effects"
            transition="all .5s ease"
            onClick={() => onPageChange(pageNumber)}
            w="40px"
            h="40px"
            borderRadius="8px"
            bg={pageNumber === page ? "blue.500" : "#fff"}
            border={pageNumber === page ? "none" : "1px solid lightgray"}
            _hover={{
              opacity: "0.7",
              borderColor: "gray.500"
            }}
            key={pageNumber}
          >
            <Text fontSize="sm" color={pageNumber === page ? "#fff" : "gray.600"}>
              {pageNumber}
            </Text>
          </Button>
        )
      })}
    </>
  )
}
