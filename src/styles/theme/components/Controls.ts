const variantOutlined = (colors) => ({
  field: {
    _focus: {
      borderColor: colors.accent[500],
      boxShadow: `0 0 0 1px ${colors.accent[500]}`
    }
  }
})

const variantFilled = (colors) => ({
  field: {
    _focus: {
      borderColor: colors.accent[500],
      boxShadow: `0 0 0 1px ${colors.accent[500]}`
    }
  }
})

const variantFlushed = (colors) => ({
  field: {
    _focus: {
      borderColor: colors.accent[500],
      boxShadow: `0 1px 0 0 ${colors.accent[500]}`
    }
  }
})

export const Input = (colors) => ({
  variants: {
    outline: variantOutlined(colors),
    filled: variantFilled(colors),
    flushed: variantFlushed(colors)
  }
})

export const Select = (colors) => ({
  variants: {
    outline: variantOutlined(colors),
    filled: variantFilled(colors),
    flushed: variantFlushed(colors)
  }
})
export const Textarea = (colors) => ({
  variants: {
    outline: variantOutlined(colors).field,
    filled: variantFilled(colors).field,
    flushed: variantFlushed(colors).field
  }
})

const Controls = {
  Input,
  Select,
  Textarea
}

export default Controls
