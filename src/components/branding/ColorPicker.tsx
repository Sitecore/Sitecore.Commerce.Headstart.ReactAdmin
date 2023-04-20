import {FormControl, FormLabel, Text, VStack} from "@chakra-ui/react"
import ColorInput from "../shared/ColorInput/ColorInput"

export const ColorPicker = ({colors, onChange}) => {
  const handleInputChange = (colorID: string) => (e) => {
    onChange(colorID, e.target.value)
  }

  return (
    <VStack alignItems="flex-start" gap={4}>
      <Text>Select a color or enter your hex code</Text>
      <FormControl>
        <FormLabel fontSize="xs" htmlFor="colorInput">
          Primary
        </FormLabel>
        <ColorInput value={colors.primary} onChange={handleInputChange("primary")} />
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs" htmlFor="colorInput">
          Secondary
        </FormLabel>
        <ColorInput value={colors.secondary} onChange={handleInputChange("secondary")} />
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs" htmlFor="colorInput">
          Accent
        </FormLabel>
        <ColorInput value={colors.accent} onChange={handleInputChange("accent")} />
      </FormControl>
    </VStack>
  )
}
