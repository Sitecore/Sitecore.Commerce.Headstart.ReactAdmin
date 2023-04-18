import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Link, useColorModeValue } from "@chakra-ui/react"
import { useState } from "react"

export const FontUploader = () => {
    const [input, setInput] = useState('')
    const handleInputChange = (e) => setInput(e.target.value)
    const linkColor = useColorModeValue("primary.500", "primary.200")
    const isError = input !== ""

    return (
        <FormControl isInvalid={isError}>
            <FormLabel fontSize="xs">Save your custom font</FormLabel>
            <Input placeholder="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" type="url" size="sm" value={input} onChange={handleInputChange} />
            {!isError ? <FormHelperText fontSize="xs">We recommend <Link color={linkColor} target="_blank" rel="noreferrer" href="https://fonts.google.com/">Google Fonts</Link>.</FormHelperText> : <FormErrorMessage fontSize="xs">Must use a valid url</FormErrorMessage>
            }
        </FormControl>
    )
}
