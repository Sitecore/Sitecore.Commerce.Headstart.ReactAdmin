import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from "@chakra-ui/react"
import React from "react"

interface PaginationInputProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}
export function PaginationInput({page, totalPages, onPageChange}: PaginationInputProps) {
  return (
    <NumberInput
      max={totalPages}
      min={1}
      w="75px"
      mx="6px"
      defaultValue="1"
      onChange={(e) => onPageChange(parseInt(e))}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper onClick={() => onPageChange(page + 1)} />
        <NumberDecrementStepper onClick={() => onPageChange(page - 1)} />
      </NumberInputStepper>
    </NumberInput>
  )
}
