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
    <Stack direction="row" m={5}>
      {page !== 1 && <PreviousNextButton type="previous" page={page} onPageChange={onChange} />}
      {totalPages > 5 ? (
        <PaginationInput totalPages={totalPages} page={page} onPageChange={onChange} />
      ) : (
        <PaginationButtons page={page} totalPages={totalPages} onPageChange={onChange} />
      )}
      {page < totalPages && <PreviousNextButton type="next" page={page} onPageChange={onChange} />}
    </Stack>
  )
}

export default Pagination
