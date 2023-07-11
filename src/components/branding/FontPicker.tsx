import {FormControl, FormLabel, Select} from "@chakra-ui/react"
import {ChangeEvent, FC} from "react"
import {AVAILABLE_GOOGLE_FONTS} from "utils/font.utils"

const FontPicker: FC<{fonts: any; onChange: any}> = ({fonts, onChange}) => {
  const handleSelectChange = (fontKey: string) => (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(fontKey, e.target.value)
  }
  return (
    <>
      <FormControl>
        <FormLabel fontSize="xs" htmlFor="HeadingFont">
          Heading Font
        </FormLabel>
        <Select id="HeadingFont" name="HeadingFont" value={fonts?.heading} onChange={handleSelectChange("heading")}>
          <option value="">Default Font</option>
          {AVAILABLE_GOOGLE_FONTS.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs" htmlFor="BodyFont">
          Body Font
        </FormLabel>
        <Select name="BodyFont" value={fonts?.body} onChange={handleSelectChange("body")}>
          <option value="">Default Font</option>
          {AVAILABLE_GOOGLE_FONTS.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

export default FontPicker
