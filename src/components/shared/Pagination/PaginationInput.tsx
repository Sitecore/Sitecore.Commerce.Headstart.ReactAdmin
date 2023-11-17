import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from "@chakra-ui/react"
import React from "react"

interface PaginationInputProps {
  inputPage: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onInputChange: (page: number) => void
}
export function PaginationInput({page, inputPage, totalPages, onPageChange, onInputChange}: PaginationInputProps) {
  return (
    <NumberInput
      max={totalPages}
      min={1}
      w="75px"
      mx="6px"
      defaultValue="1"
      value={inputPage}
      onChange={(e) => onInputChange(parseInt(e))}
      onBlur={(e) => onPageChange(parseInt(e.target.value))}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper onClick={() => onPageChange(page + 1)} />
        <NumberDecrementStepper onClick={() => onPageChange(page - 1)} />
      </NumberInputStepper>
    </NumberInput>
  )
}
