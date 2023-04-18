import tinycolor from "tinycolor2"

export function generatePalette(hex: string): any {
  return {
    50: tinycolor(hex).lighten(37.7).saturate(10.4).spin(-13).toHexString(),
    100: tinycolor(hex).lighten(31.8).saturate(10.4).spin(-9.5).toHexString(),
    200: tinycolor(hex).lighten(18.7).desaturate(17).spin(-3.9).toHexString(),
    300: tinycolor(hex).lighten(9.1).desaturate(20.9).spin(-4).toHexString(),
    400: tinycolor(hex).lighten(4.1).desaturate(6.6).spin(-3).toHexString(),
    500: hex,
    600: tinycolor(hex).darken(3.1).desaturate(12.4).spin(-2.7).toHexString(),
    700: tinycolor(hex).darken(7.8).desaturate(24.5).spin(-4).toHexString(),
    800: tinycolor(hex).darken(11.7).desaturate(23.2).spin(-4).toHexString(),
    900: tinycolor(hex).darken(17).desaturate(16.1).spin(-4).toHexString()
  }
}
