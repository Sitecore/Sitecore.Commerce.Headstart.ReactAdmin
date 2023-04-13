import { FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Text, VStack } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { brandContext } from "../Chakra";

export const ColorPicker = ({ colors, onChange }) => {

    const handleInputChange = (colorID: string) => (e) => {
        onChange(colorID, e.target.value)
    }

    return (
        <VStack alignItems="flex-start" gap={4}>
            <Text>Select a color or enter your hex code</Text>
            <FormControl>
                <FormLabel fontSize="xs" htmlFor="colorInput">Brand</FormLabel>
                <InputGroup size="sm">
                    <InputLeftAddon bgColor={colors.brand} style={{ aspectRatio: 1 / 1 }}></InputLeftAddon>
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
                <InputGroup size="sm">
                    <InputLeftAddon bgColor={colors.primary} style={{ aspectRatio: 1 / 1 }}></InputLeftAddon>
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
                <FormLabel fontSize="xs" htmlFor="colorInput">Secondary Color</FormLabel>
                <InputGroup size="sm">
                    <InputLeftAddon bgColor={colors.secondary} style={{ aspectRatio: 1 / 1 }}></InputLeftAddon>
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
