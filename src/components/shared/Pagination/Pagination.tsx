import {FC} from "react"
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
  return (
    <Stack direction="row" my={5}>
      <PreviousNextButton isDisabled={page === 1} type="previous" page={page} onPageChange={onChange} />
      {totalPages > 5 ? (
        <PaginationInput totalPages={totalPages} page={page} onPageChange={onChange} />
      ) : (
        <PaginationButtons page={page} totalPages={totalPages} onPageChange={onChange} />
      )}
      <PreviousNextButton isDisabled={page >= totalPages} type="next" page={page} onPageChange={onChange} />
    </Stack>
  )
}

export default Pagination
