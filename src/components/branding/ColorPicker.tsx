import { Button, FormControl, FormLabel, Input, SimpleGrid, VStack } from "@chakra-ui/react"
import { useState } from "react"

export const ColorPicker = () => {
    const [color, setColor] = useState("");

    const colors = [
        "gray",
        "black",
        "red",
        "green",
        "blue",
        "teal",
        "yellow",
        "orange",
        "purple",
        "pink"
    ];

    return (
        <VStack alignItems="flex-start" gap={4}>
            <SimpleGrid w="100%" gridTemplateColumns={"repeat(auto-fit, minmax(40px, 1fr))"} spacing={3}>
                {colors.map((c) => (
                    <Button
                        isActive={c === color}
                        _active={{ outline: "2px dashed", outlineColor: "cyan.300" }}
                        key={c}
                        aria-label={c}
                        background={c}
                        maxH="40px"
                        maxW="40px"
                        padding={0}
                        minWidth="unset"
                        _hover={{ background: c }}
                        onClick={() => {
                            setColor(c);
                        }}
                    />
                ))}
            </SimpleGrid>
            <FormControl>
                <FormLabel fontSize="xs" htmlFor="colorInput">Select a color or enter your hex code</FormLabel>
                <Input
                    id="colorInput"
                    placeholder="Select a color"
                    size="sm"
                    value={color}
                    onChange={(e) => {
                        setColor(e.target.value);
                    }}
                />
            </FormControl>
        </VStack>
    )
}
