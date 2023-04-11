import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(cardAnatomy.keys)

const variants = {
    levitating: definePartsStyle({
        header: {
            textTransform: "capitalize",
        },
        container: {
            transition: "all .25s ease-in-out",
            boxShadow: "md",
            textDecoration: "none",
            _hover: {
                boxShadow: "lg",
                transform: "translateY(-1px)",
                textDecoration: "none",
                borderColor: "primary.300"
            }
        }
    })
};

export const Card = defineMultiStyleConfig({ variants });