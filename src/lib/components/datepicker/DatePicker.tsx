import "react-datepicker/dist/react-datepicker.css"

import {Input, InputGroup, InputRightElement} from "@chakra-ui/react"
import React, {HTMLAttributes, forwardRef} from "react"
import ReactDatePicker, {ReactDatePickerProps} from "react-datepicker"

import {CalendarIcon} from "@chakra-ui/icons"

const customDateInput = ({value, onClick, onChange}: any, ref: any) => (
  <Input autoComplete="off" background="white" value={value} ref={ref} onClick={onClick} onChange={onChange} />
)
customDateInput.displayName = "DateInput"

const CustomInput = forwardRef(customDateInput)

interface Props {
  isClearable?: boolean
  onChange: (date: Date) => any
  selectedDate: Date | undefined
  showPopperArrow?: boolean
}

const DatePicker = ({selectedDate, onChange, ...props}: Props) => {
  return (
    <>
      <InputGroup className="dark-theme">
        <ReactDatePicker
          selected={selectedDate}
          onChange={onChange}
          className="react-datapicker__input-text"
          customInput={<CustomInput />}
          dateFormat="MM/dd/yyyy"
          {...props}
        />
        <InputRightElement color="gray.500">
          <CalendarIcon fontSize="sm" />
        </InputRightElement>
      </InputGroup>
    </>
  )
}

export default DatePicker
