import {inputAnatomy as parts} from "@chakra-ui/anatomy"
import {createMultiStyleConfigHelpers} from "@chakra-ui/styled-system"

const {defineMultiStyleConfig} = createMultiStyleConfigHelpers(parts.keys)

export const Input = defineMultiStyleConfig({
  defaultProps: {
    size: "sm"
  }
})
