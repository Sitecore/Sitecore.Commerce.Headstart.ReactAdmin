const Modal = {
  defaultProps: {
    isCentered: true,
    scrollBehavior: "inside"
  },
  baseStyle: {
    dialog: {rounded: "xl"},
    header: {py: "6", px: "8"},
    body: {px: "8"},
    footer: {py: "6", px: "6"},
    closeButton: {top: "3", insetEnd: "3"},
    overlay: {
      bg: "blackAlpha.500"
    }
  }
}

export default Modal
