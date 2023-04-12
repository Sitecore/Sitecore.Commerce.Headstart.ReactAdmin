import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { mode } from "@chakra-ui/theme-tools"
const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(cardAnatomy.keys)

const baseStyle = (props) => definePartsStyle({
    container: {
        backgroundColor: mode("white", "whiteAlpha.100")(props),
    },
})

const variants = {
    levitating: (props) => definePartsStyle({
        header: {
            textTransform: "capitalize",
        },
        container: {
            transition: "all .25s ease-in-out",
            boxShadow: "md",
            textDecoration: "none",
            border: `11px solid transparent`,
            _hover: {
                // borderColor: mode("red.500", "whiteAlpha.300")(props),
                borderColor: "st.borderColor",
                boxShadow: "lg",
                transform: "translateY(-1px)",
                textDecoration: "none",
            }
        }
    })
};

export const Card = defineMultiStyleConfig({ baseStyle, variants });