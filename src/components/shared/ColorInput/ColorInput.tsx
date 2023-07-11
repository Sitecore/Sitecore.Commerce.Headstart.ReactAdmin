import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react"
import {useCallback, useRef} from "react"

const ColorInput = ({value, onChange}) => {
  const pickerRef = useRef<HTMLInputElement>()

  const handlePickerClick = useCallback(() => {
    pickerRef.current.click()
  }, [pickerRef])
  return (
    <InputGroup>
      <InputLeftAddon
        bgColor={value}
        borderColor={useColorModeValue("gray.300", "inherit")}
        style={{aspectRatio: 1 / 1}}
        onClick={handlePickerClick}
      >
        <Input visibility="hidden" ref={pickerRef} type="color" value={value} onChange={onChange} />
      </InputLeftAddon>
      <Input id="colorInput" placeholder="Select a color" value={value} onChange={onChange} />
    </InputGroup>
  )
}

export default ColorInput
