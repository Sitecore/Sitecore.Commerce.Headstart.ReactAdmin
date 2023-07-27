import {FormControl, FormErrorMessage, FormLabel, Input} from "@chakra-ui/react"
import {useState} from "react"

export const LogoUploader = () => {
  const [input, setInput] = useState("")
  const handleInputChange = (e) => setInput(e.target.value)
  const isError = input !== ""

  return (
    <FormControl isInvalid={isError}>
      <FormLabel fontSize="xs">Save your custom logo</FormLabel>
      <Input placeholder="https://logo.com/logo.png" type="url" size="sm" value={input} onChange={handleInputChange} />
      {isError && <FormErrorMessage>Must use a valid url</FormErrorMessage>}
    </FormControl>
  )
}
