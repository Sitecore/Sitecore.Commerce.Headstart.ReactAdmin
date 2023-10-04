// https://github.com/chakra-ui/chakra-ui/tree/78d9c30e6b9477080c75b2e601394a21ed93fcf2/packages/theme/src/foundations

import borders from "./borders"
import breakpoints from "./breakpoints"
import colors from "./colors"
import radii from "./radius"
// import shadows from "./shadows";
import sizes from "./sizes"
import spacing from "./spacing"
import transition from "./transition"
import typography from "./typography"
import blur from "./blur"

const foundations = {
  breakpoints,
  radii,
  blur,
  colors,
  ...typography,
  sizes,
  //   ...shadows,
  space: spacing,
  borders,
  transition
}

export default foundations
