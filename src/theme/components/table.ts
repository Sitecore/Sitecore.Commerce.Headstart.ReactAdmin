const Table = {
  baseStyle: {
    tr: {
      th: {
        fontSize: "sm",
        textTransform: "none",
        letterSpacing: "normal",
        fontWeight: "semibold"
      },
      "&[href]:hover": {
        td: {
          backgroundColor: "blackAlpha.50"
        }
      }
    }
  },
  variants: {
    striped: {
      tr: {
        th: {
          borderColor: "none"
        },
        td: {
          borderColor: "none"
        }
      }
    }
  }
}

export default Table
