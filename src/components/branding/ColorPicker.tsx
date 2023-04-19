import { FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Text, useColorModeValue, VStack } from "@chakra-ui/react"

export const ColorPicker = ({ colors, onChange }) => {

    const handleInputChange = (colorID: string) => (e) => {
        onChange(colorID, e.target.value)
    }

    return (
        <VStack alignItems="flex-start" gap={4}>
            <Text>Select a color or enter your hex code</Text>
            <FormControl>
                <FormLabel fontSize="xs" htmlFor="colorInput">Brand</FormLabel>
                <InputGroup>
                    <InputLeftAddon bgColor={colors.brand} borderColor={useColorModeValue("gray.300", "inherit")} style={{ aspectRatio: 1 / 1 }} />
                    <Input
                        id="colorInput"
                        placeholder="Select a color"
                        value={colors.brand}
                        onChange={handleInputChange("brand")}
                    />
                </InputGroup>
            </FormControl>
            <FormControl>
                <FormLabel fontSize="xs" htmlFor="colorInput">Primary</FormLabel>
                <InputGroup>
                    <InputLeftAddon bgColor={colors.primary} borderColor={useColorModeValue("gray.300", "inherit")} style={{ aspectRatio: 1 / 1 }} />
                    <Input
                        id="colorInput"
                        placeholder="Select a color"
                        size="sm"
                        value={colors.primary}
                        onChange={handleInputChange("primary")}
                    />
                </InputGroup>
            </FormControl>
            <FormControl>
                <FormLabel fontSize="xs" htmlFor="colorInput">Secondary</FormLabel>
                <InputGroup>
                    <InputLeftAddon bgColor={colors.secondary} borderColor={useColorModeValue("gray.300", "inherit")} style={{ aspectRatio: 1 / 1 }} />
                    <Input
                        id="colorInput"
                        placeholder="Select a color"
                        size="sm"
                        value={colors.secondary}
                        onChange={handleInputChange("secondary")}
                    />
                </InputGroup>
            </FormControl>
        </VStack>
    )
}
