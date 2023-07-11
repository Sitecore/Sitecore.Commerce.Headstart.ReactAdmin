import {checkboxAnatomy as parts} from "@chakra-ui/anatomy"
import {createMultiStyleConfigHelpers} from "@chakra-ui/styled-system"

const {defineMultiStyleConfig} = createMultiStyleConfigHelpers(parts.keys)

export const Checkbox = defineMultiStyleConfig({
  defaultProps: {
    colorScheme: "primary"
  }
})
