import {defineStyle, defineStyleConfig, StyleFunctionProps} from "@chakra-ui/styled-system"
import {mode, transparentize} from "@chakra-ui/theme-tools"
import {runIfFn} from "@chakra-ui/utils"

const baseStyle = defineStyle({
  lineHeight: "1.2",
  fontWeight: "semibold",
  transitionProperty: "common",
  transitionDuration: "normal",
  borderRadius: "sm",
  _focusVisible: {
    boxShadow: "outline"
  },
  _disabled: {
    opacity: 0.4,
    cursor: "not-allowed",
    boxShadow: "none"
  },
  _hover: {
    textDecoration: "none",
    _disabled: {
      bg: "initial"
    }
  }
})

const variantGhost = defineStyle((props) => {
  const {colorScheme: c, theme} = props

  if (c === "gray") {
    return {
      color: mode(`inherit`, `whiteAlpha.900`)(props),

      _hover: {
        bg: mode(`blackAlpha.100`, `whiteAlpha.200`)(props)
      },
      _active: {bg: mode(`blackAlpha.200`, `whiteAlpha.300`)(props)}
    }
  }

  const darkHoverBg = transparentize(`${c}.200`, 0.12)(theme)
  const darkActiveBg = transparentize(`${c}.200`, 0.24)(theme)

  return {
    color: mode(`${c}.500`, `${c}.200`)(props),

    bg: "transparent",
    _hover: {
      bg: mode(`${c}.100`, darkHoverBg)(props)
    },
    _active: {
      bg: mode(`${c}.200`, darkActiveBg)(props)
    }
  }
})

const variantOutline = defineStyle((props) => {
  const {colorScheme: c} = props
  const borderColor = mode(`blackAlpha.200`, `whiteAlpha.300`)(props)
  return {
    border: "1px solid",
    textDecoration: "none",

    "&:hover": {
      textDecoration: "none !important"
    },
    borderColor: c === "gray" ? borderColor : "currentColor",
    ".chakra-button__group[data-attached][data-orientation=horizontal] > &:not(:last-of-type)": {marginEnd: "-1px"},
    ".chakra-button__group[data-attached][data-orientation=vertical] > &:not(:last-of-type)": {marginBottom: "-1px"},
    ...runIfFn(variantGhost, props)
  }
})

type AccessibleColor = {
  bg?: string
  color?: string
  hoverBg?: string
  activeBg?: string
}

/** Accessible color overrides for less accessible colors. */
const accessibleColorMap: {[key: string]: AccessibleColor} = {
  yellow: {
    bg: "yellow.400",
    color: "black",
    hoverBg: "yellow.500",
    activeBg: "yellow.600"
  },
  cyan: {
    bg: "cyan.400",
    color: "black",
    hoverBg: "cyan.500",
    activeBg: "cyan.600"
  }
}

const variantSolid = defineStyle((props) => {
  const {colorScheme: c} = props

  if (c === "gray") {
    const bg = "primary.500"

    return {
      bg,
      color: "white",

      _hover: {
        bg: "primary.600",
        _disabled: {
          bg: mode(`primary.300`, `primary.400`)(props)
        }
      },
      _active: {bg: mode(`primary.300`, `primary.400`)(props)}
    }
  }

  const {bg = `${c}.500`, color = "white", hoverBg = `${c}.600`, activeBg = `${c}.700`} = accessibleColorMap[c] ?? {}

  const background = mode(bg, `${c}.200`)(props)

  return {
    bg: background,

    color: mode(color, `gray.800`)(props),
    _hover: {
      bg: mode(hoverBg, `${c}.300`)(props),
      _disabled: {
        bg: background
      }
    },
    _active: {bg: mode(activeBg, `${c}.400`)(props)}
  }
})

const variants = {
  ghost: variantGhost,
  outline: variantOutline,
  solid: variantSolid,
  navHorizontal: (props: StyleFunctionProps) => ({
    px: "2",
    color: mode("blackAlpha.600", "whiteAlpha.700")(props),
    rounded: "none",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    _hover: {
      bg: "transparent",
      borderBottomWidth: 2,
      borderBottomColor: mode("primary.500", "primary.200")(props),
      color: mode("primary.500", "primary.200")(props)
    },
    _active: {
      bg: "blackAlpha.200"
    }
  }),
  navHorizontalActive: {
    size: "sm",
    px: "2",
    color: "primary.600",
    rounded: "md",
    bg: "primary.100",
    _active: {
      bg: "primary.200"
    }
  },
  navVertical: {
    px: "3",
    height: 8,
    justifyContent: "none",
    color: "blackAlpha.600",
    rounded: "md",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 4,
    borderRightColor: "transparent",
    transitionDelay: ".025s",
    _hover: {
      borderRightColor: "primary.100"
    },
    _active: {
      bg: "blackAlpha.100",
      color: "primary.500",
      borderRightColor: "primary.400"
    }
  },
  navVerticalRight: {
    px: "3",
    height: 8,
    width: "100%",
    justifyContent: "none",
    color: "blackAlpha.600",
    rounded: "md",
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
    borderTopLeftRadius: "0",
    borderBottomLeftRadius: "0",
    transitionDelay: ".025s",
    textDecoration: "none",
    _hover: {
      borderLeftColor: "primary.100",
      textDecoration: "none"
    },
    _active: {
      bg: "blackAlpha.100",
      color: "primary.500",
      borderLeftColor: "primary.400"
    }
  },
  navVerticalActive: {
    px: "3",
    justifyContent: "none",
    color: "primary.600",
    rounded: "md",
    bg: "primary.100",
    _active: {
      bg: "primary.200"
    }
  }
}

const buttonTheme = defineStyleConfig({
  baseStyle,
  variants,
  defaultProps: {
    size: "sm"
  }
})

const Button = {
  ...buttonTheme
}

export default Button
