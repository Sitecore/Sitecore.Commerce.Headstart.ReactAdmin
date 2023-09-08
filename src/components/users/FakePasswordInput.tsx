import {FormControl, FormLabel, Input} from "@chakra-ui/react"

interface FakePasswordInputProps {
  label: string
  onClick: () => void
}

export function FakePasswordInput({label, onClick}: FakePasswordInputProps) {
  return (
    <FormControl>
      <FormLabel m={0}>{label}</FormLabel>
      <Input type="password" value="*********" onClick={onClick} />
    </FormControl>
  )
}
