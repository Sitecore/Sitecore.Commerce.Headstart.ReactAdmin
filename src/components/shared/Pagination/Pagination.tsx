import {FC, useState} from "react"
import {Stack} from "@chakra-ui/react"
import {PaginationButtons} from "./PaginationButtons"
import {PaginationInput} from "./PaginationInput"
import {PreviousNextButton} from "./PreviousNextButton"

interface IPagination {
  page: number
  totalPages: number
  onChange: (newPage: number) => void
}

const Pagination: FC<IPagination> = ({page, totalPages, onChange}) => {
  const [inputPage, setInputPage] = useState(page)

  const handlePageChange = (page: number) => {
    onChange(page)
    setInputPage(page)
  }

  return (
    <Stack direction="row" my={5}>
      <PreviousNextButton isDisabled={page === 1} type="previous" page={page} onPageChange={handlePageChange} />
      {totalPages > 5 ? (
        <PaginationInput
          totalPages={totalPages}
          page={page}
          inputPage={inputPage}
          onPageChange={handlePageChange}
          onInputChange={setInputPage}
        />
      ) : (
        <PaginationButtons page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
      <PreviousNextButton isDisabled={page >= totalPages} type="next" page={page} onPageChange={handlePageChange} />
    </Stack>
  )
}

export default Pagination
